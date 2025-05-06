// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract LiquidityPool {
    address public owner;
    uint public totalFunds;

    // Mapping to track user debt

    mapping(address => uint) public userDebt;

    // Before incorporating the ZK verification, we can use a placeholder credit score 0-100
    mapping(address => uint8) public creditScore;

    // Mapping to track when each user last borrowed

    mapping(address => uint) public borrowTimestamp;

    // Events for Borrow and Repay actions

    event Borrowed (address indexed borrower, uint amount, uint timestamp);
    event Repaid (address indexed payer, uint amount, uint timestamp);

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

    // function to allow users to borrow funds
    function borrow(uint amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(creditScore[msg.sender] >= 60, "Credit score too low");

        // maximum half of the total funds can be borrowed
        require(amount <= totalFunds /2, "Insufficient funds in the pool");
        userDebt[msg.sender] += amount;
        totalFunds -= amount;
        borrowTimestamp[msg.sender] = block.timestamp;
        payable(msg.sender).transfer(amount);

        emit Borrowed(msg.sender, amount, block.timestamp);
    }

    // function to allow users to repay their debt
    function repay() external payable {
        require(userDebt[msg.sender] > 0, "No outstanding debt");
        require(msg.value > 0, "Must send ETH to repay");

        // if the user sends more than their debt, only the debt amount is deducted
        uint repayAmount = msg.value > userDebt[msg.sender] ? userDebt[msg.sender] : msg.value;
        userDebt[msg.sender] -= repayAmount;
        // extra funds remain in the contract, added to the pool. We can also change it to be refunded to the user
        totalFunds += repayAmount;

        emit Repaid(msg.sender, repayAmount, block.timestamp);
    }

    // function for users to see their debt
    function getMyDebt() external view returns (uint) {
        return userDebt[msg.sender];
    }

    // function to set credit score (will be replaced later)

    function setCreditScore(address user, uint8 score) external {
        require(msg.sender == owner, "Not owner");
        require(score <= 100, "Invalid credit score");
        creditScore[user] = score;
    }
}
