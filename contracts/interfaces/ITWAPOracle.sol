// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

interface ITWAPOracle {
    function consult(
        address token,
        uint amountIn
    ) external view returns (uint amountOut);
}
