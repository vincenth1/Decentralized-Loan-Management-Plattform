require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");

require("dotenv").config();

<<<<<<< Updated upstream
=======
const { SONIC_RPC_URL, PRIVATE_KEY, SONIC_PRIVATE_KEY } = process.env;


>>>>>>> Stashed changes
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
    }
  }
};
