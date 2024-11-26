// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public primogems;
    mapping(uint256 => uint256) public primogemPrices;

    event PrimogemDeposit(uint256 amount);
    event PrimogemWithdraw(uint256 amount);

    constructor(uint initPrimogems) payable {
        owner = payable(msg.sender);
        primogems = initPrimogems;

        // Set prices in wei (1 ETH = 10^18 wei)
        primogemPrices[60] = 0.00099 ether;    // $0.99
        primogemPrices[300] = 0.00499 ether;   // $4.99
        primogemPrices[980] = 0.01499 ether;   // $14.99
        primogemPrices[1980] = 0.02999 ether;  // $29.99
        primogemPrices[3280] = 0.04999 ether;  // $49.99
        primogemPrices[6480] = 0.09999 ether;  // $99.99
    }

    function getPrimogems() public view returns(uint256) {
        return primogems;
    }

    function depositPrimogems(uint256 _amount) public payable {
        uint _previousBalance = primogems;
        require(msg.sender == owner, "You are not the Traveler of this account");
        require(_amount == 60 || _amount == 300 || _amount == 980 || _amount == 1980 || _amount == 3280 || _amount == 6480, "Invalid primogem amount");
        require(msg.value == primogemPrices[_amount], "Incorrect ETH amount sent");

        primogems += _amount;
        assert(primogems == _previousBalance + _amount);
        emit PrimogemDeposit(_amount);
    }

    error InsufficientPrimogems(uint256 balance, uint256 withdrawAmount);

    function withdrawPrimogems(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the Traveler of this account");
        require(_withdrawAmount == 160 || _withdrawAmount == 1600, "You can only withdraw 160 (1 wish) or 1600 (10 wishes) primogems");
        uint _previousBalance = primogems;
        if (primogems < _withdrawAmount) {
            revert InsufficientPrimogems({
                balance: primogems,
                withdrawAmount: _withdrawAmount
            });
        }
        primogems -= _withdrawAmount;
        assert(primogems == (_previousBalance - _withdrawAmount));
        emit PrimogemWithdraw(_withdrawAmount);
    }

    function getPrimogemPrice(uint256 _amount) public view returns(uint256) {
        return primogemPrices[_amount];
    }
}
