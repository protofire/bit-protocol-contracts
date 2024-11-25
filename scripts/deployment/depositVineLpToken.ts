import { ethers } from "hardhat";

const { contracts } = require("../config/index.ts");

const lpToken = "0x1FFdE6D469DAA9Ddb49922357cc2B441DeF4E019";
const trove = "0x44fa3A93b5df7033D97c889De322512ac460284E";
const lpOracle = "0x0A078D570bD8DBD1c452ad8e576Fa243eDD67b17";

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
