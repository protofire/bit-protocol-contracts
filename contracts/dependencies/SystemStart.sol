// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "../interfaces/IBitCore.sol";

/**
    @title Bit System Start Time
    @dev Provides a unified `startTime` and `getWeek`, used for emissions.
 */
contract SystemStart {
    uint256 immutable startTime;

    constructor(address bitCore) {
        startTime = IBitCore(bitCore).startTime();
    }

    function getWeek() public view returns (uint256 week) {
        return (block.timestamp - startTime) / 1 weeks;
    }
}
