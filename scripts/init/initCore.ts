import { Wallet } from "ethers";
import hre from "hardhat";

const NETWORK = process.env.NETWORK || "localhost";

const { adminPrivateKey } = require(`../config/${NETWORK}.ts`);
const { contracts } = require("../config/index.ts");

const addressZero = "0x0000000000000000000000000000000000000000";

// TODO: REMOVE THE DEPLOYMENT OF THE SECOND TROVE MANAGER

async function main() {
  const adminWallet = new Wallet(adminPrivateKey, hre.ethers.provider);

  const signer = await hre.ethers.getSigner(adminWallet.address);

  const core = await hre.ethers.getContractAt(
    "BitCore",
    contracts["BitCore"].address,
    signer
  );

  const debtToken = await hre.ethers.getContractAt(
    "DebtToken",
    contracts["DebtToken"].address,
    signer
  );

  const factory = await hre.ethers.getContractAt(
    "Factory",
    contracts["Factory"].address,
    signer
  );

  const stabilityPool = await hre.ethers.getContractAt(
    "StabilityPool",
    contracts["StabilityPool"].address,
    signer
  );

  const incentiveVoting = await hre.ethers.getContractAt(
    "IncentiveVoting",
    contracts["IncentiveVoting"].address,
    signer
  );

  const bitVault = await hre.ethers.getContractAt(
    "BitVault",
    contracts["BitVault"].address,
    signer
  );

  const bitToken = await hre.ethers.getContractAt(
    "BitToken",
    contracts["BitToken"].address,
    signer
  );

  if (NETWORK !== "sapphire") {
    const mockBand = await hre.ethers.getContractAt(
      "LPPriceOracle",
      contracts["LPPriceOracle"].address,
      signer
    );

    await mockBand.setPrice("1000000000000000000");
  }

  const tokenLocker = await hre.ethers.getContractAt(
    "TokenLocker",
    contracts["TokenLocker"].address,
    signer
  );

  console.log("here 1");
  // CORE CONFIG
  await core.setFeeReceiver(contracts["FeeReceiver"].address);
  await core.setPriceFeed(contracts["PriceFeed"].address);

  console.log("here 2");
  // BitToken config
  await bitToken.setInitialParameters(
    contracts["BitVault"].address,
    contracts["TokenLocker"].address
  );
  console.log("here 3");
  // DebtToken config
  await debtToken.setInitialParameters(
    contracts["Factory"].address,
    contracts["GasPool"].address,
    contracts["StabilityPool"].address,
    contracts["BorrowerOperations"].address
  );
  console.log("here 4");
  await debtToken.setSecrecy(true);
  console.log("here 5");
  // FACTORY CONFIG
  await factory.setInitialParameters(
    contracts["StabilityPool"].address,
    contracts["BorrowerOperations"].address,
    contracts["SortedTroves"].address,
    contracts["TroveManager"].address,
    contracts["LiquidationManager"].address
  );
  console.log("here 6");
  const tx = await factory.deployNewInstance(
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
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
  console.log("here 7");
  const troveManagerDeployment = await factory.troveManagers(0);

  const troveManager = await hre.ethers.getContractAt(
    "TroveManager",
    troveManagerDeployment,
    signer
  );

  // SETTING A MOCK STAKING CONTRACT
  // if (NETWORK !== "sapphire") {
  //   await troveManager.setPriceFeed(
  //     contracts["PriceFeed"].address,
  //     addressZero
  //   );
  // }

  console.log("Trove Manager deployed at:", troveManagerDeployment);

  // set price feed (trove Manager)

  const sortedTrove = await troveManager.sortedTroves();

  const priceFeed = await hre.ethers.getContractAt(
    "PriceFeed",
    contracts["PriceFeed"].address,
    signer
  );

  await priceFeed.setOracle(
    "0x1a384b3EC67372f4765C5d2cD5Fd786Beb51bc05",
    contracts["LPPriceOracle"].address,
    "PRO",
    "USD",
    86400
  );
  console.log("here 8");
  const tx1 = await factory.deployNewInstance(
    "0x1a384b3EC67372f4765C5d2cD5Fd786Beb51bc05",
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

  await tx1.wait();
  console.log("here 9");
  const troveManagerDeploy2 = await factory.troveManagers(1);

  const troveManager2 = await hre.ethers.getContractAt(
    "TroveManager",
    troveManagerDeploy2,
    signer
  );

  const sortedTrove2 = await troveManager2.sortedTroves();

  await troveManager2.setLookers(
    [
      sortedTrove2,
      contracts["MultiTroveGetter"].address,
      contracts["MultiCollateralHintHelpers"].address,
      contracts["TroveManagerGetters"].address,
      contracts["LiquidationManager"].address,
    ],
    [true, true, true, true, true]
  );

  console.log("Trove Manager 2 deployed at:", troveManagerDeploy2);

  // TROVE MANAGER/Debt Token SET LOOKERS
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
  console.log("here 10");
  await debtToken.setLookers(
    [troveManagerDeployment, troveManagerDeploy2],
    [true, true]
  );
  console.log("here 11");
  // StabilityPool config
  await stabilityPool.setInitialParameters(
    contracts["BitVault"].address,
    contracts["LiquidationManager"].address
  );
  console.log("here 12");
  // INCENTIVE VOTING CONFIG
  await incentiveVoting.setInitialParameters(
    contracts["TokenLocker"].address,
    contracts["BitVault"].address
  );
  console.log("here 13");
  // BitVault config
  await bitVault.setInitialParameters(
    contracts["EmissionSchedule"].address,
    contracts["BoostCalculator"].address,
    "100000000000000000000000000",
    "26",
    [],
    [
      {
        receiver: adminWallet.address,
        amount: "1700000000000000000000000",
      },
      {
        receiver: contracts["IDOTokenVesting"].address,
        amount: "5300000000000000000000000",
      },
      {
        receiver: contracts["TokenVesting"].address,
        amount: "38000000000000000000000000",
      },
    ]
  );
  console.log("here 14");
  await bitToken.transferFrom(
    contracts["BitVault"].address,
    adminWallet.address,
    "1510000000000000000000000"
  );

  // REGISTER EMISSIONS RECEIVERS
  await bitVault.registerReceiver(troveManagerDeployment, 2);
  console.log("here 15");
  // 7 days
  await tokenLocker.setAllowPenaltyWithdrawAfter(1729882414);
  console.log("here 16");
  // TOKEN LOCKER CONFIG
  await tokenLocker.setPenaltyWithdrawalsEnabled(true);
  console.log("here 17");
}

main()
  .then(() => console.log("Core contracts initilized"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
