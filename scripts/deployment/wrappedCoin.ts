import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  const wrapped = await ethers.getContractFactory("WrappedBTC", deployer);
  const contract = await wrapped.deploy();
  await contract.waitForDeployment();

  console.log("Wrapped deployed to:", await contract.getAddress());
}

main()
  .then(() => console.log("Wrapped deployed"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
