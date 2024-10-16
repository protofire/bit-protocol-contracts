import { ethers } from "hardhat";

const { contracts } = require("../config/index.ts");

const lpToken = "0xfc9F6D99ED73dF84aB2EfCb99DA226ef85D41dc6";
const trove = "0x481bd081c5Fa1B9a895a1302e6d7CCd3F9C34051";
const lpOracle = "0x1dAA4A7f8BCa61dF8EFD157593ba0197487Ca043";

async function main() {
  const [deployer] = await ethers.getSigners();

  const depositBitLpToken = await ethers.getContractFactory(
    "DepositBitLpToken",
    deployer
  );
  const contract = await depositBitLpToken.deploy(
    contracts["BitToken"].address,
    lpToken,
    contracts["BitVault"].address,
    trove,
    contracts["BitCore"].address,
    lpOracle
  );
  await contract.waitForDeployment();

  console.log("DepositBitLpToken deployed to:", await contract.getAddress());
}

main()
  .then(() => console.log("DepositBitLpToken deployed"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
