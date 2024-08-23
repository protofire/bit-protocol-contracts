import { ethers } from "hardhat";

export default async () => {
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the MockLpToken contract with the account:",
    deployer.address
  );

  const MockLpToken = await ethers.getContractFactory("MockLpToken");
  const mockLpToken = await MockLpToken.deploy();
  await mockLpToken.waitForDeployment();

  console.log("MockLpToken deployed to:", mockLpToken.getAddress());
  return mockLpToken;
};
