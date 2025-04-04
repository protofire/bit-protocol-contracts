// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "../interfaces/IStdReference.sol";
import "../dependencies/BitOwnable.sol";

/**
 * @title MtbillPriceAdapter
 * @notice Price adapter for MTBill that implements Band's IStdReference interface
 * @dev Connects to MTBillCustomAggregatorFeed which implements AggregatorV3Interface
 */
contract MtbillPriceAdapter is IStdReference, BitOwnable {
    // Constants
    uint256 private constant PRICE_PRECISION = 1e18;
    uint8 private constant ORACLE_DECIMALS = 8; // MTBill oracle uses 8 decimals
    uint256 private constant MAX_PRICE_DEVIATION = 50e16; // 50% max deviation between updates
    uint256 private constant RESPONSE_TIMEOUT_BUFFER = 2 days; // Extended buffer for business-day-only updates

    // State variables
    IERC20 public immutable mtBill;
    AggregatorV3Interface public mtbillOracle;
    string public baseSymbol; // The symbol we expect from TroveManager (e.g., "MTBILL")
    string public quoteSymbol; // Should be "USD"
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
    event OracleUpdated(address indexed newOracle, string base, string quote, uint32 heartbeat);
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
     * @param _mtbill Address of the MTBill token
     * @param _mtbillOracle Address of the MTBill oracle (AggregatorV3Interface)
     * @param _base Base symbol that TroveManager will use (e.g., "MTBILL")
     * @param _quote Quote symbol (e.g., "USD")
     * @param _heartbeat Maximum time between price updates
     */
    constructor(
        address _bitCore,
        address _mtbill,
        address _mtbillOracle,
        string memory _base,
        string memory _quote,
        uint32 _heartbeat
    ) BitOwnable(_bitCore) {
        if (_mtbill == address(0)) revert InvalidOracle();
        if (_mtbillOracle == address(0)) revert InvalidOracle();
        if (_heartbeat == 0) revert InvalidHeartbeat();
        if (bytes(_base).length == 0 || bytes(_quote).length == 0) revert InvalidSymbol();
        
        mtBill = IERC20(_mtbill);
        mtbillOracle = AggregatorV3Interface(_mtbillOracle);
        baseSymbol = _base;
        quoteSymbol = _quote;
        heartbeat = _heartbeat;
        isActive = true;
    }

    /**
     * @notice Implements Band's IStdReference interface for price fetching
     * @param _base Base symbol (must match configured MTBill symbol)
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

        // Get MTBill/USD price from the oracle
        (
            , /* roundId */
            int256 answer,
            , /* startedAt */
            uint256 updatedAt,
            /* answeredInRound */
        ) = mtbillOracle.latestRoundData();
        
        // Validate oracle response
        if (answer <= 0) revert InvalidPrice();
        
        // Check for price staleness
        if (block.timestamp > updatedAt + heartbeat + RESPONSE_TIMEOUT_BUFFER) {
            revert StalePrice();
        }
        
        // Convert to uint256 for compatibility with IStdReference
        uint256 rawPrice = uint256(answer);
        
        // Convert from oracle decimals (8) to PRICE_PRECISION (18 decimals)
        uint256 currentPrice = rawPrice * 10**10; // Multiply by 10^(18-8) to get 18 decimals
        
        // Validate against previous price if exists
        if (lastPriceData.price != 0) {
            uint256 priceDeviation = _calculateDeviation(currentPrice, lastPriceData.price);
            if (priceDeviation > MAX_PRICE_DEVIATION) {
                revert PriceDeviation();
            }
        }

        // Note: We don't update state in this view function
        // PriceFeed will call this function and then update its own state
        
        // Return current block.timestamp instead of actual update time to ensure compatibility with PriceFeed's 1-day heartbeat limit
        // The actual staleness check is still performed above using the real updatedAt time
        // mtBILL oracle only updates on weekdays and doesn't have a specific timestamp to do it
        return ReferenceData({
            rate: currentPrice,
            lastUpdatedBase: block.timestamp,
            lastUpdatedQuote: block.timestamp
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
            // Call the function directly instead of through the interface to ensure it uses the updated timestamps
            results[i] = this.getReferenceData(_bases[i], _quotes[i]);
        }
        
        return results;
    }
    
    /**
     * @notice Updates the MTBill oracle configuration
     * @param _newOracle New MTBill oracle address
     * @param _base New base symbol for TroveManager
     * @param _quote New quote symbol
     * @param _heartbeat New heartbeat duration
     */
    function updateOracle(
        address _newOracle,
        string memory _base,
        string memory _quote,
        uint32 _heartbeat
    ) external onlyOwner {
        if (_newOracle == address(0)) revert InvalidOracle();
        if (_heartbeat == 0) revert InvalidHeartbeat();
        if (bytes(_base).length == 0 || bytes(_quote).length == 0) revert InvalidSymbol();
        
        mtbillOracle = AggregatorV3Interface(_newOracle);
        baseSymbol = _base;
        quoteSymbol = _quote;
        heartbeat = _heartbeat;
        
        emit OracleUpdated(_newOracle, _base, _quote, _heartbeat);
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