import { ethers } from "hardhat";

const { contracts } = require("../config/index.ts");

const lpToken = "0x15F2b1Dc4c427A8a022ba1Bb457fcbb1172E1855";
const trove = "0x6E9Efb78343aa7302E1035E0b0F84711f45fAC68";
const lpOracle = "0xB1066f2B3E8fc94051295D9A63330C2bd31C00a5";

async function main() {
  const [deployer] = await ethers.getSigners();

  const depositBitLpToken = await ethers.getContractFactory(
    "StakeDlpToken",
    deployer
  );
  const contract = await depositBitLpToken.deploy(
    contracts["BitToken"].address,
    lpToken,
    contracts["BitVault"].address,
    trove,
    contracts["BitCore"].address,
    lpOracle
  );
  await contract.waitForDeployment();

  console.log("StakeDlpToken deployed to:", await contract.getAddress());
}

main()
  .then(() => console.log("StakeDlpToken deployed"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
