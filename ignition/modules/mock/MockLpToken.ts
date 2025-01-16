import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the MockLpToken contract with the account:",
    deployer.address
  );

  const MockLpToken = await ethers.getContractFactory("MockLpToken");
  const mockLpToken = await MockLpToken.deploy();
  await mockLpToken.waitForDeployment();

  console.log("MockLpToken deployed to:", await mockLpToken.getAddress());
}

main()
  .then(() => console.log("Mock Lp Token deployed"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
