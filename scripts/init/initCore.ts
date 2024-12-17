import { Wallet } from "ethers";
import hre from "hardhat";

const NETWORK = process.env.NETWORK || "localhost";

const { adminPrivateKey } = require(`../config/${NETWORK}.ts`);
const { contracts } = require("../config/index.ts");

const addressZero = "0x0000000000000000000000000000000000000000";

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

  if (NETWORK === "testnet") {
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

  console.log("Core configuration...");
  // CORE CONFIG
  await core.setFeeReceiver(contracts["FeeReceiver"].address);
  await core.setPriceFeed(contracts["PriceFeed"].address);

  console.log("BitToken configuration...");
  // BitToken config
  await bitToken.setInitialParameters(
    contracts["BitVault"].address,
    contracts["TokenLocker"].address
  );
  console.log("DebtToken configuration...");
  // DebtToken config
  await debtToken.setInitialParameters(
    contracts["Factory"].address,
    contracts["GasPool"].address,
    contracts["StabilityPool"].address,
    contracts["BorrowerOperations"].address
  );
  await debtToken.setSecrecy(true);

  console.log("Factory configuration...");
  // FACTORY CONFIG
  await factory.setInitialParameters(
    contracts["StabilityPool"].address,
    contracts["BorrowerOperations"].address,
    contracts["SortedTroves"].address,
    contracts["TroveManager"].address,
    contracts["LiquidationManager"].address
  );

  console.log("Deploying Trove Manager...");
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
      maxDebt: "100000000000000000000000000000",
      MCR: "1500000000000000000",
    }
  );
  await tx.wait();

  const troveManagerDeployment = await factory.troveManagers(0);

  const troveManager = await hre.ethers.getContractAt(
    "TroveManager",
    troveManagerDeployment,
    signer
  );

  console.log("Trove Manager deployed at:", troveManagerDeployment);

  const sortedTrove = await troveManager.sortedTroves();

  console.log("Trove Manager configuration...");
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

  console.log("Setting trove manager as looker for DebtToken...");
  await debtToken.setLookers(
    [troveManagerDeployment],
    // [troveManagerDeployment, troveManagerDeploy2],
    [true, true]
  );

  console.log("StabilityPool configuration...");
  // StabilityPool config
  await stabilityPool.setInitialParameters(
    contracts["BitVault"].address,
    contracts["LiquidationManager"].address
  );

  console.log("Incentive Voting configuration...");
  // INCENTIVE VOTING CONFIG
  await incentiveVoting.setInitialParameters(
    contracts["TokenLocker"].address,
    contracts["BitVault"].address
  );

  // console.log("BitVault configuration...");
  // // BitVault config
  // await bitVault.setInitialParameters(
  //   contracts["EmissionSchedule"].address,
  //   contracts["BoostCalculator"].address,
  //   "100000000000000000000000000",
  //   "26",
  //   [],
  //   [
  //     {
  //       receiver: adminWallet.address,
  //       amount: "1700000000000000000000000",
  //     },
  //     {
  //       receiver: contracts["IDOTokenVesting"].address,
  //       amount: "5300000000000000000000000",
  //     },
  //     {
  //       receiver: contracts["TokenVesting"].address,
  //       amount: "38000000000000000000000000",
  //     },
  //   ]
  // );

  // console.log("BitVault transfering BitToken to developers");
  // await bitToken.transferFrom(
  //   contracts["BitVault"].address,
  //   adminWallet.address,
  //   "1510000000000000000000000"
  // );

  // console.log("Registering trove manager as receiver");
  // REGISTER EMISSIONS RECEIVERS
  // await bitVault.registerReceiver(troveManagerDeployment, 2);

  // console.log("TokenLocker setAllowPenaltyWithdrawAfter");
  // 7 days TODO: make this timestamp dynamic
  // await tokenLocker.setAllowPenaltyWithdrawAfter(1729882414);

  // console.log("TokenLocker setPenaltyWithdrawalsEnabled");
  // TOKEN LOCKER CONFIG
  // await tokenLocker.setPenaltyWithdrawalsEnabled(true);
}

main()
  .then(() => console.log("Core contracts initilized"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
