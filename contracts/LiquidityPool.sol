// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract LiquidityPool {
    address public owner;
    uint public totalFunds;

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        totalFunds += msg.value;
    }

    function extract(uint amount) external {
        require(msg.sender == owner, "Not owner");
        require(amount <= address(this).balance, "Insufficient balance");

        totalFunds -= amount;
        payable(owner).transfer(amount);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}
