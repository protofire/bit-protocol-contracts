// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

contract MockTwapOracle {
    address public token0;
    address public token1;
    uint224 public price0Average;
    uint224 public price1Average;

    function setTokens(address _token0, address _token1) external {
        token0 = _token0;
        token1 = _token1;
    }

    function setPriceAverages(
        uint224 _price0Average,
        uint224 _price1Average
    ) external {
        price0Average = _price0Average;
        price1Average = _price1Average;
    }

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
