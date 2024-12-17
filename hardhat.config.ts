import "@oasisprotocol/sapphire-hardhat";
import * as dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const config: HardhatUserConfig = {
  sourcify: {
    enabled: true,
  },
  solidity: {
    version: "0.8.22",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1,
      },
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      chainId: 31337,
    },
    sapphire: {
      url: process.env.SAPPHIRE_URL,
      chainId: 23294,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    "sapphire-testnet": {
      url: "https://testnet.sapphire.oasis.dev/",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 0x5aff,
      allowUnlimitedContractSize: true,
    },
  },
};

export default config;
