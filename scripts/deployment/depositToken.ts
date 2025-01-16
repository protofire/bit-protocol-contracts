import { ethers } from "hardhat";

const { contracts } = require("../config/index.ts");

const lpToken = "0xC682Eb99486ACDD5a896bda6bD3198FE26f78Bb6";

async function main() {
  const [deployer] = await ethers.getSigners();

  const depositToken = await ethers.getContractFactory(
    "StakeLPToken",
    deployer
  );
  const contract = await depositToken.deploy(
    contracts["BitToken"].address,
    lpToken,
    contracts["BitVault"].address,
    contracts["BitCore"].address
  );
  await contract.waitForDeployment();

  console.log("StakeLPToken deployed to:", await contract.getAddress());
}

main()
  .then(() => console.log("StakeLPToken deployed"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
