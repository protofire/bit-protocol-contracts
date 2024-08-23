// import "@oasisprotocol/sapphire-hardhat";
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
      chainId: parseInt(process.env.CHAIN_ID || "0"),
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      // TODO: FIND A BETTER SOLUTION FOR MAINNET DEPLOYMENT
      allowUnlimitedContractSize: true,
    },
    "sapphire-testnet": {
      url: "https://testnet.sapphire.oasis.dev/",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 0x5aff,
    },
    "sapphire-localnet": {
      url: "http://localhost:8545",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 0x5afd,
    },
    "zkbtc-testnet": {
      url: "https://devilmorallyelephant-rpc.eu-north-2.gateway.fm/",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 19236265,
    },
  },
};

export default config;
