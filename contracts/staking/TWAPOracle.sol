// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "../external/LuminexV1Factory.sol";
import "../external/OracleLibrary.sol";
import "../external/V2Library.sol";

/**
 * @title TWAP Oracle
 * @notice Oracle responsible for proving prices based on TWAP from uniswap v2 pools.
 */

contract TWAPOracle {
    uint public constant PERIOD = 24 hours;

    ILuminexV1Pair public immutable pair;
    address public immutable token0;
    address public immutable token1;

    uint public price0CumulativeLast;
    uint public price1CumulativeLast;
    uint32 public blockTimestampLast;
    uint224 public price0Average;
    uint224 public price1Average;

    constructor(address poolAddress) {
        ILuminexV1Pair _pair = ILuminexV1Pair(poolAddress);
        pair = _pair;
        token0 = _pair.token0();
        token1 = _pair.token1();
        price0CumulativeLast = _pair.price0CumulativeLast(); // fetch the current accumulated price value (1 / 0)
        price1CumulativeLast = _pair.price1CumulativeLast(); // fetch the current accumulated price value (0 / 1)
        uint112 reserve0;
        uint112 reserve1;
        (reserve0, reserve1, blockTimestampLast) = _pair.getReserves();
        require(reserve0 != 0 && reserve1 != 0, "TWAPOracle: NO_RESERVES"); // ensure that there's liquidity in the pair
    }

    function update() external {
        (
            uint price0Cumulative,
            uint price1Cumulative,
            uint32 blockTimestamp
        ) = UniswapV2OracleLibrary.currentCumulativePrices(address(pair));
        uint32 timeElapsed = blockTimestamp - blockTimestampLast; // overflow is desired

        // ensure that at least one full period has passed since the last update
        require(timeElapsed >= PERIOD, "TWAPOracle: PERIOD_NOT_ELAPSED");

        // overflow is desired, casting never truncates
        price0Average = uint224(
            (price0Cumulative - price0CumulativeLast) / timeElapsed
        );
        price1Average = uint224(
            (price1Cumulative - price1CumulativeLast) / timeElapsed
        );

        price0CumulativeLast = price0Cumulative;
        price1CumulativeLast = price1Cumulative;
        blockTimestampLast = blockTimestamp;
    }

    // note this will always return 0 before update has been called successfully for the first time.
    function consult(
        address token,
        uint amountIn
    ) public view returns (uint amountOut) {
        if (token == token0) {
            amountOut = (price0Average * amountIn) >> 112;
        } else {
            require(token == token1, "TWAPOracle: INVALID_TOKEN");
            amountOut = (price1Average * amountIn) >> 112;
        }
    }
}
