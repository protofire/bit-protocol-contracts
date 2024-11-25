import { ethers } from "ethers";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();

const TWAP_ORACLE = "0xf62C50065cead19Fe8cD2dccdA94485CF78A2534";
const PRIVATE_KEY = "";

const ORACLE_ABI = ["function update() external"];

const provider = new ethers.JsonRpcProvider(
  "https://23294.rpc.thirdweb.com/abbe50b532aac2f8f14c0b7ef2eef279"
);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Create a contract instance
const oracleContract = new ethers.Contract(TWAP_ORACLE, ORACLE_ABI, wallet);

async function updateOracle() {
  try {
    const tx = await oracleContract.update();
    console.log(`Transaction sent: ${tx.hash}`);
    await tx.wait();
    console.log("Transaction confirmed");
  } catch (error) {
    console.error("Error updating oracle:", error);
  }
}

// Schedule the cron job to run every 24 hours
cron.schedule("0 0 * * *", () => {
  console.log("Running cron job to update oracle");
  updateOracle();
});

console.log("Cron job scheduled to run every 24 hours");
