import { ethers } from "hardhat";

const priceFeed = "0xB54EAdD05f8C891076138743841841148dC290bf";
const TwapOracle = "0xA4313Bc4D12C4b852B736c812A3114411554435C";
const wrappedRose = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

async function main() {
  const [deployer] = await ethers.getSigners();

  const bitLpChecker = await ethers.getContractFactory("BitLPOracle", deployer);
  const contract = await bitLpChecker.deploy(
    priceFeed,
    TwapOracle,
    wrappedRose
  );
  await contract.waitForDeployment();

  console.log("Bit LP Checker deployed to:", await contract.getAddress());
}

main()
  .then(() => console.log("Bit LP Checker deployed"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
