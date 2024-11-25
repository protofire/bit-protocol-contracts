import { ethers } from "hardhat";

const { contracts } = require("../config/index.ts");

const lpToken = "0x41bec4E1eD8CAa443Efd208ABe5134B5EC0b4a3a";

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
