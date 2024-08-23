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
    "VineCore",
    contracts["VineCore"].address,
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

  const vineVault = await hre.ethers.getContractAt(
    "VineVault",
    contracts["VineVault"].address,
    signer
  );

  const vineToken = await hre.ethers.getContractAt(
    "VineToken",
    contracts["VineToken"].address,
    signer
  );

  if (NETWORK !== "sapphire") {
    const mockBand = await hre.ethers.getContractAt(
      "LPPriceOracle",
      contracts["LPPriceOracle"].address,
      signer
    );

    await mockBand.setPrice("60418000000000000000000");
  }

  const tokenLocker = await hre.ethers.getContractAt(
    "TokenLocker",
    contracts["TokenLocker"].address,
    signer
  );

  // CORE CONFIG
  await core.setFeeReceiver(contracts["FeeReceiver"].address);
  await core.setPriceFeed(contracts["PriceFeed"].address);

  // VineToken config
  await vineToken.setInitialParameters(
    contracts["VineVault"].address,
    contracts["TokenLocker"].address
  );

  // DebtToken config
  await debtToken.setInitialParameters(
    contracts["Factory"].address,
    contracts["GasPool"].address,
    contracts["StabilityPool"].address,
    contracts["BorrowerOperations"].address
  );

  // await debtToken.setSecrecy(true);

  // FACTORY CONFIG
  await factory.setInitialParameters(
    contracts["StabilityPool"].address,
    contracts["BorrowerOperations"].address,
    contracts["SortedTroves"].address,
    contracts["TroveManager"].address,
    contracts["LiquidationManager"].address
  );

  const tx = await factory.deployNewInstance(
    "0xB5EA3151e1edED183CC9571916B435b6B188D508",
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

  const troveManagerDeployment = await factory.troveManagers(0);

  const troveManager = await hre.ethers.getContractAt(
    "TroveManager",
    troveManagerDeployment,
    signer
  );

  const sortedTrove = await troveManager.sortedTroves();

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

  await debtToken.setLookers([troveManagerDeployment], [true]);

  // // StabilityPool config
  await stabilityPool.setInitialParameters(
    contracts["VineVault"].address,
    contracts["LiquidationManager"].address
  );

  // // INCENTIVE VOTING CONFIG
  await incentiveVoting.setInitialParameters(
    contracts["TokenLocker"].address,
    contracts["VineVault"].address
  );

  // VineVault config
  await vineVault.setInitialParameters(
    contracts["EmissionSchedule"].address,
    contracts["BoostCalculator"].address,
    "100000000000000000000000000",
    "19",
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

  await vineToken.transferFrom(
    contracts["VineVault"].address,
    adminWallet.address,
    "1510000000000000000000000"
  );

  // TOKEN LOCKER CONFIG
  // await tokenLocker.setPenaltyWithdrawalsEnabled(true);
  // 7 days
  // await tokenLocker.setAllowPenaltyWithdrawAfter(0);
}

main()
  .then(() => console.log("Core contracts initilized"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
