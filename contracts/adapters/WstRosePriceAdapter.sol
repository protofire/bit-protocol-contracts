// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/interfaces/IERC4626.sol";
import "../interfaces/IStdReference.sol";
import "../dependencies/BitOwnable.sol";

/**
 * @title WstRosePriceAdapter
 * @notice Price adapter for wstRose that implements Band's IStdReference interface
 * @dev Calculates USD price using:
 * - wstRose pricePerShare (conversion rate to stRose)
 * - ROSE/USD price from Band oracle
 */
contract WstRosePriceAdapter is IStdReference, BitOwnable {
    // Constants
    uint256 private constant PRICE_PRECISION = 1e18;
    uint256 private constant MAX_PRICE_DEVIATION = 50e16; // 50% max deviation between updates
    uint256 private constant RESPONSE_TIMEOUT_BUFFER = 1 hours;

    // State variables
    IERC4626 public immutable wstRose = IERC4626(0x3cAbbe76Ea8B4e7a2c0a69812CBe671800379eC8);
    IStdReference public bandOracle;
    string public baseSymbol; // The symbol we expect from TroveManager (e.g., "wstRose")
    string public quoteSymbol; // Should be "USD"
    string public bandBaseSymbol; // The symbol we'll use with Band oracle (e.g., "ROSE")
    uint32 public heartbeat;
    bool public isActive;
    
    struct PriceData {
        uint256 price;
        uint256 timestamp;
        uint256 lastUpdated;
    }
    
    PriceData public lastPriceData;
    
    // Events
    event PriceUpdated(uint256 price, uint256 timestamp);
    event OracleUpdated(address indexed newOracle, string base, string quote, string bandBase, uint32 heartbeat);
    event StatusUpdated(bool isActive);
    
    // Errors
    error PriceDeviation();
    error StalePrice();
    error InvalidPrice();
    error InvalidOracle();
    error InvalidHeartbeat();
    error AdapterInactive();
    error InvalidSymbol();
    
    /**
     * @param _bitCore Address of BitCore contract
     * @param _bandOracle Address of the Band oracle for ROSE/USD
     * @param _base Base symbol that TroveManager will use (e.g., "wstRose")
     * @param _quote Quote symbol (e.g., "USD")
     * @param _bandBase Base symbol for Band oracle queries (e.g., "ROSE")
     * @param _heartbeat Maximum time between price updates
     */
    constructor(
        address _bitCore,
        address _bandOracle,
        string memory _base,
        string memory _quote,
        string memory _bandBase,
        uint32 _heartbeat
    ) BitOwnable(_bitCore) {
        if (_bandOracle == address(0)) revert InvalidOracle();
        if (_heartbeat == 0) revert InvalidHeartbeat();
        if (bytes(_base).length == 0 || bytes(_quote).length == 0 || bytes(_bandBase).length == 0) revert InvalidSymbol();
        
        bandOracle = IStdReference(_bandOracle);
        baseSymbol = _base;
        quoteSymbol = _quote;
        bandBaseSymbol = _bandBase;
        heartbeat = _heartbeat;
        isActive = true;
    }

    /**
     * @notice Implements Band's IStdReference interface for price fetching
     * @param _base Base symbol (must match configured wstRose symbol)
     * @param _quote Quote symbol (must match configured quote)
     * @return ReferenceData containing price and timestamp information
     */
    function getReferenceData(string memory _base, string memory _quote)
        external
        view
        override
        returns (ReferenceData memory)
    {
        if (!isActive) revert AdapterInactive();
        
        // Verify the requested symbols match our configuration
        if (keccak256(bytes(_base)) != keccak256(bytes(baseSymbol)) ||
            keccak256(bytes(_quote)) != keccak256(bytes(quoteSymbol))) {
            revert InvalidSymbol();
        }

        // Get wstRose to stRose conversion rate
        uint256 pricePerShare = wstRose.convertToAssets(PRICE_PRECISION);
        if (pricePerShare == 0) revert InvalidPrice();
        
        // Get ROSE/USD price from Band oracle using our bandBaseSymbol
        ReferenceData memory roseData = bandOracle.getReferenceData(bandBaseSymbol, quoteSymbol);
        
        // Validate oracle response
        if (roseData.rate == 0) revert InvalidPrice();
        
        // Check for price staleness
        if (block.timestamp > roseData.lastUpdatedBase + heartbeat + RESPONSE_TIMEOUT_BUFFER ||
            block.timestamp > roseData.lastUpdatedQuote + heartbeat + RESPONSE_TIMEOUT_BUFFER) {
            revert StalePrice();
        }
        
        // Calculate wstRose price in USD
        uint256 currentPrice = (pricePerShare * roseData.rate) / PRICE_PRECISION;
        
        // Validate against previous price if exists
        if (lastPriceData.price != 0) {
            uint256 priceDeviation = _calculateDeviation(currentPrice, lastPriceData.price);
            if (priceDeviation > MAX_PRICE_DEVIATION) {
                revert PriceDeviation();
            }
        }

        return ReferenceData({
            rate: currentPrice,
            lastUpdatedBase: roseData.lastUpdatedBase,
            lastUpdatedQuote: roseData.lastUpdatedQuote
        });
    }

    /**
     * @notice Implements Band's bulk price query interface
     * @dev Since this adapter only supports one pair, it will revert if asked for others
     */
    function getReferenceDataBulk(string[] memory _bases, string[] memory _quotes)
        external
        view
        override
        returns (ReferenceData[] memory)
    {
        require(_bases.length == _quotes.length, "Length mismatch");
        
        ReferenceData[] memory results = new ReferenceData[](_bases.length);
        
        for (uint256 i = 0; i < _bases.length; i++) {
            results[i] = this.getReferenceData(_bases[i], _quotes[i]);
        }
        
        return results;
    }
    
    /**
     * @notice Updates the Band oracle configuration
     * @param _newOracle New Band oracle address
     * @param _base New base symbol for TroveManager
     * @param _quote New quote symbol
     * @param _bandBase New base symbol for Band oracle queries
     * @param _heartbeat New heartbeat duration
     */
    function updateOracle(
        address _newOracle,
        string memory _base,
        string memory _quote,
        string memory _bandBase,
        uint32 _heartbeat
    ) external onlyOwner {
        if (_newOracle == address(0)) revert InvalidOracle();
        if (_heartbeat == 0) revert InvalidHeartbeat();
        if (bytes(_base).length == 0 || bytes(_quote).length == 0 || bytes(_bandBase).length == 0) revert InvalidSymbol();
        
        bandOracle = IStdReference(_newOracle);
        baseSymbol = _base;
        quoteSymbol = _quote;
        bandBaseSymbol = _bandBase;
        heartbeat = _heartbeat;
        
        emit OracleUpdated(_newOracle, _base, _quote, _bandBase, _heartbeat);
    }
    
    /**
     * @notice Calculates the deviation between two prices
     * @param _currentPrice Current price
     * @param _previousPrice Previous price
     * @return Deviation percentage with 18 decimals precision
     */
    function _calculateDeviation(uint256 _currentPrice, uint256 _previousPrice) internal pure returns (uint256) {
        if (_previousPrice > _currentPrice) {
            return ((_previousPrice - _currentPrice) * PRICE_PRECISION) / _previousPrice;
        }
        return ((_currentPrice - _previousPrice) * PRICE_PRECISION) / _previousPrice;
    }
    
    /**
     * @notice Toggles the adapter's active status
     * @param _isActive New status
     */
    function setStatus(bool _isActive) external onlyOwner {
        isActive = _isActive;
        emit StatusUpdated(_isActive);
    }
}
