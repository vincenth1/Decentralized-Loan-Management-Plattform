require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("@nomicfoundation/hardhat-verify");

require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    fantomTestnet: {
      url: process.env.FTM_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 4002,
    },
    sonicTestnet: {
      url: process.env.SONIC_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 57054,
    },
  },
  etherscan: {
    apiKey: {
      sonicTestnet: process.env.SONIC_SCAN_API_KEY, // maps to customChain below
    },
    customChains: [
      {
        network: "sonicTestnet",
        chainId: 57054,
        urls: {
          apiURL: "https://api-testnet.sonicscan.org/api",
          browserURL: "https://testnet.sonicscan.org",
        },
      },
    ],
  },
};
