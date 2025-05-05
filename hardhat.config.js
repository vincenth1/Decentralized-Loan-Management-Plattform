require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { FTM_RPC_URL, SONIC_RPC_URL, PRIVATE_KEY, SONIC_PRIVATE_KEY } = process.env;


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sonicTestnet: {
      url: process.env.SONIC_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 57054,
    }
  }
};
