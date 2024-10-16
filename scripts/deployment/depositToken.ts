import { ethers } from "hardhat";

const { contracts } = require("../config/index.ts");

const lpToken = "0xA84d4f19B19427745C7f4656EB05Dd14FDBDAA75";

async function main() {
  const [deployer] = await ethers.getSigners();

  const depositToken = await ethers.getContractFactory(
    "DepositToken",
    deployer
  );
  const contract = await depositToken.deploy(
    contracts["BitToken"].address,
    lpToken,
    contracts["BitVault"].address,
    contracts["BitCore"].address
  );
  await contract.waitForDeployment();

  console.log("DepositToken deployed to:", await contract.getAddress());
}

main()
  .then(() => console.log("DepositToken deployed"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
