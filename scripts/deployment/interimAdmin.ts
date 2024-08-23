import { ethers } from "hardhat";

const { contracts } = require("../config/index.ts");

async function main() {
  const [deployer] = await ethers.getSigners();

  const interimAdmin = await ethers.getContractFactory(
    "InterimAdmin",
    deployer
  );
  const contract = await interimAdmin.deploy(contracts["VineCore"].address);
  await contract.waitForDeployment();

  console.log("InterimAdmin deployed to:", await contract.getAddress());
}

main()
  .then(() => console.log("InterimAdmin deployed"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
