import { Wallet } from "ethers";
import hre from "hardhat";

const NETWORK = process.env.NETWORK || "localhost";

const { adminPrivateKey } = require(`../config/${NETWORK}.ts`);
const { contracts } = require("../config/index.ts");

const depositVineLPToken = "0xE4F88f60f3C3262Be66FDfca40FA9Fbd64Cf7aD9";
const depositToken = "0x7EAAB9F7C992eE3cD1D9F055511Af5741B372124";
const trove = "0x06eBC049Fa9d394Aa660E79b94c0278C677ba773";

async function main() {
  const adminWallet = new Wallet(adminPrivateKey, hre.ethers.provider);

  const signer = await hre.ethers.getSigner(adminWallet.address);

  const vineVault = await hre.ethers.getContractAt(
    "VineVault",
    contracts["VineVault"].address,
    signer
  );

  const vineToken = await hre.ethers.getContractAt(
    "VineToken",
    contracts["VineToken"].address,
    signer
  );

  // Register Receiver
  await vineVault.registerReceiver(trove, 2);
  await vineVault.registerReceiver(depositVineLPToken, 1);
  await vineVault.registerReceiver(depositToken, 1);

  // VINE TOKEN CONFIG
  await vineToken.setSwapTo(depositVineLPToken, true);
  await vineToken.setTradeFrom(depositVineLPToken, true);
  await vineToken.setTradeTime(Math.floor(new Date().getTime() / 1000)); // TODAY
}

main()
  .then(() => console.log("Earn contracts initilized"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
