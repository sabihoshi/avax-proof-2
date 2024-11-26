# Genshin Impact Wishing System DApp

A decentralized application (DApp) that simulates Genshin Impact's wishing system using blockchain technology. This project demonstrates a simple implementation of digital asset management and microtransactions using the Ethereum blockchain.

## Features

### Primogem Purchase System
- Purchase Primogems using ETH at various price points:
  - 60 Primogems ($0.99)
  - 300 Primogems ($4.99)
  - 980 Primogems ($14.99)
  - 1980 Primogems ($29.99)
  - 3280 Primogems ($49.99)
  - 6480 Primogems ($99.99)

### Wishing System
- Make wishes using your Primogems:
  - Single Wish: 160 Primogems
  - Ten Wishes: 1600 Primogems

### Smart Contract Features
- Secure primogem storage
- Owner-only access control
- Real ETH transactions for primogem purchases
- Custom error handling for insufficient primogems
- Event emission for tracking purchases and wishes

## Technology Stack
- Frontend: Next.js + React
- Smart Contracts: Solidity
- Development Environment: Hardhat
- Web3 Integration: ethers.js
- Wallet Connection: MetaMask

## Getting Started

### Prerequisites
- Node.js (LTS version recommended)
- MetaMask wallet extension installed in your browser
- Basic understanding of blockchain transactions

### Installation and Setup
1. Inside the project directory, in the terminal type: `npm i`
2. Open two additional terminals in your VS code
3. In the second terminal type: `npx hardhat node`
4. In the third terminal, type: `npx hardhat run --network localhost scripts/deploy.js`
5. Back in the first terminal, type `npm run dev` to launch the front-end

The application will be running at http://localhost:3000/

### Connecting Your Wallet
1. Ensure MetaMask is installed and set up
2. Connect to the localhost:8545 network in MetaMask
3. Import one of the test accounts provided by Hardhat
4. Click "Connect your Traveler Wallet" in the application

## Smart Contract Details
The WishingSystem smart contract (located at `contracts/Assessment.sol`) handles:
- Primogem balance management
- ETH-based purchases
- Wish transactions
- Access control for the Traveler (owner)

## Security Features
- Owner-only access for critical functions
- Input validation for primogem purchases and wishes
- Balance checks before transactions
- Secure ETH handling for purchases

## Contributing
Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
