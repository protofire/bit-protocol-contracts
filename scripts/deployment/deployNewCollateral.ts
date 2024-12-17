import { ethers } from "hardhat";

const { contracts } = require("../config/index.ts");

// const priceFeed = await hre.ethers.getContractAt(
//   "PriceFeed",
//   contracts["PriceFeed"].address,
//   signer
// );

// await priceFeed.setOracle(
//   "0x1a384b3EC67372f4765C5d2cD5Fd786Beb51bc05",
//   contracts["LPPriceOracle"].address,
//   "PRO",
//   "USD",
//   86400
// );
// console.log("here 8");
// const tx1 = await factory.deployNewInstance(
//   "0x1a384b3EC67372f4765C5d2cD5Fd786Beb51bc05",
//   contracts["PriceFeed"].address,
//   addressZero, // address(0) to use the default
//   addressZero, // address(0) to use the default
//   {
//     minuteDecayFactor: "999037758833783000",
//     redemptionFeeFloor: "5000000000000000",
//     maxRedemptionFee: "1000000000000000000",
//     borrowingFeeFloor: "5000000000000000",
//     maxBorrowingFee: "50000000000000000",
//     interestRateInBps: "100",
//     maxDebt: "10000000000000000000000000000",
//     MCR: "1500000000000000000",
//   }
// );

// await tx1.wait();
// console.log("here 9");
// const troveManagerDeploy2 = await factory.troveManagers(1);

// const troveManager2 = await hre.ethers.getContractAt(
//   "TroveManager",
//   troveManagerDeploy2,
//   signer
// );

// const sortedTrove2 = await troveManager2.sortedTroves();

// await troveManager2.setLookers(
//   [
//     sortedTrove2,
//     contracts["MultiTroveGetter"].address,
//     contracts["MultiCollateralHintHelpers"].address,
//     contracts["TroveManagerGetters"].address,
//     contracts["LiquidationManager"].address,
//   ],
//   [true, true, true, true, true]
// );

// console.log("Trove Manager 2 deployed at:", troveManagerDeploy2);

// ADD THE ADDRESS OF THE COLLATERAL TOKEN
const collateralAddress = "0xCa9DdE1B0f02CDA170d05dD2F56c6cC1126AA195";
const addressZero = "0x0000000000000000000000000000000000000000";
// MAKE SURE TO CHANGE THIS TO THE CORRECT INDEX
const collateralIndex = 2;

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
    contracts["LPPriceOracle"].address,
    "PROTO",
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
      maxDebt: "10000000000000000000000000000",
      MCR: "1500000000000000000",
    }
  );

  await tx.wait();

  const troveManagerDeployment = await factory.troveManagers(collateralIndex);
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
