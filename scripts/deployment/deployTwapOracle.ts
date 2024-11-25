import { ethers } from "hardhat";

const pool = "0x70A83aeA847676F820dA766d6e4975165E2fd852";

async function main() {
  const [deployer] = await ethers.getSigners();

  const oracle = await ethers.getContractFactory("BitChecker", deployer);

  const contract = await oracle.deploy();
  await contract.waitForDeployment();

  console.log("TWAP Oracle deployed to:", await contract.getAddress());
}

// async function main() {
//   const [deployer] = await ethers.getSigners();

//   const oracle = await ethers.getContractFactory("MockTwapOracle", deployer);

//   const contract = await oracle.deploy();
//   await contract.waitForDeployment();

//   console.log("TWAP Oracle deployed to:", await contract.getAddress());
// }

main()
  .then(() => console.log("TWAP Oracle deployed"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
