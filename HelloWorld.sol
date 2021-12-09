// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.5.10;

contract HelloWorld {
  string myName = "Tristan";
  
  // Add this function:
  function getMyName() public view returns(string memory) {
    return myName;
  }
  
  function changeMyName(string memory _newName) public {
    myName = _newName;
  }
}