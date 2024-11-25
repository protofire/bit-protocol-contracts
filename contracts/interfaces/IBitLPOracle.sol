// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

interface IBitLPOracle {
    function getLPPrice() external view returns (uint price);
}
