// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract WishingSystem {
    address payable public traveler;
    uint256 public primogems;
    mapping(uint256 => uint256) public primogemPrices;

    event PrimogemPurchase(uint256 amount);
    event WishMade(uint256 amount);

    constructor(uint initPrimogems) payable {
        traveler = payable(msg.sender);
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

    function purchasePrimogems(uint256 _amount) public payable {
        uint _previousBalance = primogems;
        require(msg.sender == traveler, "You are not the Traveler of this account");
        require(_amount == 60 || _amount == 300 || _amount == 980 || _amount == 1980 || _amount == 3280 || _amount == 6480, "Invalid primogem amount");
        require(msg.value == primogemPrices[_amount], "Incorrect ETH amount sent");

        primogems += _amount;
        assert(primogems == _previousBalance + _amount);
        emit PrimogemPurchase(_amount);
    }

    error InsufficientPrimogems(uint256 balance, uint256 wishCost);

    function makeWish(uint256 _wishAmount) public {
        require(msg.sender == traveler, "You are not the Traveler of this account");
        require(_wishAmount == 160 || _wishAmount == 1600, "You can only make 1 wish (160) or 10 wishes (1600)");
        uint _previousBalance = primogems;
        if (primogems < _wishAmount) {
            revert InsufficientPrimogems({
                balance: primogems,
                wishCost: _wishAmount
            });
        }
        primogems -= _wishAmount;
        assert(primogems == (_previousBalance - _wishAmount));
        emit WishMade(_wishAmount);
    }

    function getPrimogemPrice(uint256 _amount) public view returns(uint256) {
        return primogemPrices[_amount];
    }
}
