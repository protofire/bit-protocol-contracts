// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "../interfaces/IBitCore.sol";

/**
    @title Bit Ownable
    @notice Contracts inheriting `BitOwnable` have the same owner as `BitCore`.
            The ownership cannot be independently modified or renounced.
 */
contract BitOwnable {
    IBitCore public immutable bit_CORE;

    constructor(address _bitCore) {
        bit_CORE = IBitCore(_bitCore);
    }

    modifier onlyOwner() {
        require(msg.sender == bit_CORE.owner(), "Only owner");
        _;
    }

    function owner() public view returns (address) {
        return bit_CORE.owner();
    }

    function guardian() public view returns (address) {
        return bit_CORE.guardian();
    }
}
