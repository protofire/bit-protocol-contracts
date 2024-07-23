import "@oasisprotocol/sapphire-hardhat";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import { HardhatUserConfig } from "hardhat/config";

import * as dotenv from "dotenv";

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
        runs: 1000,
      },
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      chainId: 1337, // We set 1337 to make interacting with MetaMask simpler (31337),
      // UNCOMMENT TO ENABLE FORKING
      // forking: {
      //   enabled: true,
      //   url: "https://oasis-sapphire-mainnet.core.chainstack.com/af94b4996475be2a75572ddb802e7ba4",
      //   // blockNumber: 2744265,
      // },
      // chains: {
      //   23294: {
      //     hardforkHistory: {
      //       berlin: 1000000,
      //       london: 2000000,
      //     },
      //   },
      // },
    },
    sapphire: {
      url: process.env.SAPPHIRE_URL,
      chainId: parseInt(process.env.CHAIN_ID || "0"),
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      // TODO: FIND A BETTER SOLUTION FOR MAINNET DEPLOYMENT
      allowUnlimitedContractSize: true,
    },
    "sapphire-localnet": {
      url: "http://localhost:8545",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 0x5afd,
    },
  },
};

export default config;
