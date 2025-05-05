# Decentralized-Loan-Management-Plattform
![s1](https://github.com/user-attachments/assets/e8faaaed-bca7-4d50-9ac9-67c70db765cc)
## 1. Install Dependencies
### Hardhat backend (root folder):
`npm install`
### React frontend
```
cd frontend
npm install
```
## 2. Set Up .env file
Create a .env file in the root project directory with the following content:
```
# SONIC testnet RPC URL
FTM_RPC_URL=https://rpc.blaze.soniclabs.com

# Private key of the wallet that will deploy the contract (no quotes)
PRIVATE_KEY=your_private_key_without_quotes
```
## 3. Compile smart contract
In the Hardhat backend (root folder):
`npx hardhat compile`
## 4. Deploy smart contract to Sonic Testnet
`npx hardhat run scripts/deploy.js --network fantomTestnet` <br/>
Copy the deployed contract address from the output (needed in the frontend).
## 5. Export ABI to frontend
`cp artifacts/contracts/LiquidityPool.sol/LiquidityPool.json frontend/src/LiquidityPool.json`
## 6. Add contract info to frontend
In `frontend/src/App.jsx`:
- Import the ABI:
```
import contractJson from "./LiquidityPool.json";
const ABI = contractJson.abi;
```
- Replace the contract address:
`const CONTRACT_ADDRESS = "your_deployed_contract_address";`
## 7. Run frontend app
```
cd frontend
npm run dev
```
## 8. Interact
- Connect MetaMask to Sonic testnet
- Add 0.1 Sonic to the contract
- Extract 0.05 Sonic (only as the contract owner)
- View contract balance

