//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintableToken is ERC20, Ownable {

  constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {}

  function mint(address account, uint256 amount) public virtual onlyOwner {
      _mint(account, amount);
  }

  function burn(address account, uint256 amount) public virtual onlyOwner {
      _burn(account, amount);
  }

}
