import { ethers } from "hardhat";

const { contracts } = require("../config/index.ts");

// ADD THE ADDRESS OF THE COLLATERAL TOKEN
const collateralAddress = "0x3cAbbe76Ea8B4e7a2c0a69812CBe671800379eC8";
const addressZero = "0x0000000000000000000000000000000000000000";
const oracleAddress = "0x89be90AA5f97ba655878e99fF46ca7D199ed1762";
const maxDebt = "75000000000000000000000";
// MAKE SURE TO CHANGE THIS TO THE CORRECT INDEX
const collateralIndex = 1;


async function main() {
  const [deployer] = await ethers.getSigners();

  const factory = await ethers.getContractAt(
    "Factory",
    contracts["Factory"].address,
    deployer
  );

  const debtToken = await ethers.getContractAt(
    "DebtToken",
    contracts["DebtToken"].address,
    deployer
  );

  const priceFeed = await ethers.getContractAt(
    "PriceFeed",
    contracts["PriceFeed"].address,
    deployer
  );

  await priceFeed.setOracle(
    collateralAddress,
    oracleAddress,
    "wstROSE",
    "USD",
    86400
  );

  console.log("here 0");

  const tx = await factory.deployNewInstance(
    collateralAddress,
    contracts["PriceFeed"].address,
    addressZero, // address(0) to use the default
    addressZero, // address(0) to use the default
    {
      minuteDecayFactor: "999037758833783000",
      redemptionFeeFloor: "5000000000000000",
      maxRedemptionFee: "1000000000000000000",
      borrowingFeeFloor: "5000000000000000",
      maxBorrowingFee: "50000000000000000",
      interestRateInBps: "100",
      maxDebt,
      MCR: "1500000000000000000",
    }
  );

  await tx.wait();

  const troveManagerDeployment = await factory.troveManagers(collateralIndex);

  if (troveManagerDeployment === addressZero) {
    throw new Error("Trove Manager not deployed");
  }

  const oldTrove = await factory.troveManagers(0);

  const troveManager = await ethers.getContractAt(
    "TroveManager",
    troveManagerDeployment,
    deployer
  );

  const sortedTrove = await troveManager.sortedTroves();

  await troveManager.setLookers(
    [
      sortedTrove,
      contracts["MultiTroveGetter"].address,
      contracts["MultiCollateralHintHelpers"].address,
      contracts["TroveManagerGetters"].address,
      contracts["LiquidationManager"].address,
    ],
    [true, true, true, true, true]
  );

  await debtToken.setLookers([troveManagerDeployment, oldTrove], [true, true]);

  console.log("Trove Manager deployed at:", troveManagerDeployment);
}

main()
  .then(() => console.log("New collateral deployed"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
