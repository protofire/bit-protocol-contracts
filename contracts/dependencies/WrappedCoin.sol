// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WrappedBTC is ERC20, Ownable {
    constructor() ERC20("Wrapped BTC", "wBTC") Ownable(msg.sender) {}

    // Fallback function to accept ETH
    receive() external payable {
        _mint(msg.sender, msg.value);
    }

    // Function to deposit ETH and receive WETH
    function deposit() external payable {
        _mint(msg.sender, msg.value);
    }

    // Function to withdraw WETH and receive ETH
    function withdraw(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient WETH balance");
        _burn(msg.sender, amount);
        payable(msg.sender).transfer(amount);
    }
}
