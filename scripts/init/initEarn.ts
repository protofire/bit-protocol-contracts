import { Wallet } from "ethers";
import hre from "hardhat";

const NETWORK = process.env.NETWORK || "localhost";

const { adminPrivateKey } = require(`../config/${NETWORK}.ts`);
const { contracts } = require("../config/index.ts");

const depositBitLPToken = "0xE4F88f60f3C3262Be66FDfca40FA9Fbd64Cf7aD9";
const depositToken = "0x7EAAB9F7C992eE3cD1D9F055511Af5741B372124";
const trove = "0x06eBC049Fa9d394Aa660E79b94c0278C677ba773";

async function main() {
  const adminWallet = new Wallet(adminPrivateKey, hre.ethers.provider);

  const signer = await hre.ethers.getSigner(adminWallet.address);

  const bitVault = await hre.ethers.getContractAt(
    "BitVault",
    contracts["BitVault"].address,
    signer
  );

  const bitToken = await hre.ethers.getContractAt(
    "BitToken",
    contracts["BitToken"].address,
    signer
  );

  // Register Receiver
  await bitVault.registerReceiver(trove, 2);
  await bitVault.registerReceiver(depositBitLPToken, 1);
  await bitVault.registerReceiver(depositToken, 1);

  // bit TOKEN CONFIG
  await bitToken.setSwapTo(depositBitLPToken, true);
  await bitToken.setTradeFrom(depositBitLPToken, true);
  await bitToken.setTradeTime(Math.floor(new Date().getTime() / 1000)); // TODAY
}

main()
  .then(() => console.log("Earn contracts initilized"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
