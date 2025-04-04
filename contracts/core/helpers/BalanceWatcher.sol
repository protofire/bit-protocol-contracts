// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../dependencies/BitOwnable.sol";

/**
    @title BalanceWatcher
    @notice Contract used to watch the balance of a specific address.
            Can be used to watch the balance of a contract.
 */
contract BalanceWatcher is BitOwnable {

  address immutable public BITUSD;
  address private immutable BITCORE;
  address public addressToWatch;
  mapping(address => bool) public watchers;

  event WatcherAdded(address indexed watcher);
  event WatcherRemoved(address indexed watcher);

  modifier onlyWatcher() {
    require(watchers[msg.sender], "Not a watcher");
    _;
  }

  constructor(address _bitusd, address _bitCore, address _addressToWatch) BitOwnable(_bitCore) {
    BITUSD = _bitusd;
    BITCORE = _bitCore;
    addressToWatch = _addressToWatch;
  }

  function setAddressToWatch(address _addressToWatch) external onlyOwner {
    addressToWatch = _addressToWatch;
  }

  function getBalance() external onlyWatcher view returns (uint256) {
    return IERC20(BITUSD).balanceOf(addressToWatch);
  }

  function addWatcher(address _watcher) external onlyOwner {
    watchers[_watcher] = true;
    emit WatcherAdded(_watcher);
  }

  function removeWatcher(address _watcher) external onlyOwner {
    watchers[_watcher] = false;
    emit WatcherRemoved(_watcher);
  }
}
