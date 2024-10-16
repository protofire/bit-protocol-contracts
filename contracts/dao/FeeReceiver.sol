// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../dependencies/BitOwnable.sol";

contract FeeReceiver is BitOwnable {
    using SafeERC20 for IERC20;

    constructor(address _bitCore) BitOwnable(_bitCore) {}

    function transferToken(
        IERC20 token,
        address receiver,
        uint256 amount
    ) external onlyOwner {
        token.safeTransfer(receiver, amount);
    }

    function setTokenApproval(
        IERC20 token,
        address spender,
        uint256 amount
    ) external onlyOwner {
        token.forceApprove(spender, amount);
    }

    function transferRose(address receiver, uint256 amount) external onlyOwner {
        payable(receiver).transfer(amount);
    }

    receive() external payable {}
}
