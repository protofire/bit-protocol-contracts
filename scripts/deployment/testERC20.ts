import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  const token = await ethers.getContractFactory("MockToken", deployer);
  const contract = await token.deploy("Protofire", "PRO");
  await contract.waitForDeployment();

  console.log("ERC20 deployed to:", await contract.getAddress());
}

main()
  .then(() => console.log("ERC20 deployed"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
