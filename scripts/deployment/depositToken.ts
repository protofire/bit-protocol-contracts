import { ethers } from "hardhat";

const { contracts } = require("../config/index.ts");

const lpToken = "0x2BCD9a9Cc2a49E00cB58b9EE3855dF5bC80dfFee";

async function main() {
  const [deployer] = await ethers.getSigners();

  const depositToken = await ethers.getContractFactory(
    "DepositToken",
    deployer
  );
  const contract = await depositToken.deploy(
    contracts["VineToken"].address,
    lpToken,
    contracts["VineVault"].address,
    contracts["VineCore"].address
  );
  await contract.waitForDeployment();

  console.log("DepositToken deployed to:", await contract.getAddress());
}

main()
  .then(() => console.log("VineCore deployed"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
