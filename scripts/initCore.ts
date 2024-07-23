import { Wallet } from "ethers";
import hre from "hardhat";

const NETWORK = process.env.NETWORK || "localhost";

const { adminPrivateKey } = require(`./config/${NETWORK}.ts`);
const { contracts } = require("./config/index.ts");

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

  // const tokenVesting = await hre.ethers.getContractAt(
  //   "TokenVesting",
  //   contracts["TokenVesting"].address,
  //   signer
  // );

  // const tokenLocker = await hre.ethers.getContractAt(
  //   "TokenLocker",
  //   contracts["TokenLocker"].address,
  //   signer
  // );

  // const illuminexFactory = await hre.ethers.getContractAt(
  //   "LuminexV1Factory",
  //   "0x045551B6A4066db850A1160B8bB7bD9Ce3A2B5A5",
  //   signer
  // );

  // CORE CONFIG
  await core.setFeeReceiver(contracts["FeeReceiver"].address);
  await core.setPriceFeed(contracts["PriceFeed"].address);

  // VineToken config
  await vineToken.setInitialParameters(
    contracts["VineVault"].address,
    contracts["TokenLocker"].address
  );

  // TODO
  // await vineToken.setSwapTo("");
  // await vineToken.setTradeTime("");
  // await vineToken.setTradeFrom("");

  // DebtToken config
  await debtToken.setInitialParameters(
    contracts["Factory"].address,
    contracts["GasPool"].address,
    contracts["StabilityPool"].address,
    contracts["BorrowerOperations"].address
  );

  // FACTORY CONFIG
  await factory.setInitialParameters(
    contracts["StabilityPool"].address,
    contracts["BorrowerOperations"].address,
    contracts["SortedTroves"].address,
    contracts["TroveManager"].address,
    contracts["LiquidationManager"].address
  );

  await factory.deployNewInstance(
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

  // StabilityPool config
  await stabilityPool.setInitialParameters(
    contracts["VineVault"].address,
    contracts["LiquidationManager"].address
  );

  // INCENTIVE VOTING CONFIG
  await incentiveVoting.setInitialParameters(
    contracts["TokenLocker"].address,
    contracts["VineVault"].address
  );

  // VineVault config
  // TODO: decide the real values for mainnet of (fixedInitialAmount and initialAllowances)
  await vineVault.setInitialParameters(
    contracts["EmissionSchedule"].address,
    contracts["BoostCalculator"].address,
    "100000000000000000000000000",
    "19",
    [],
    []
  );

  // DEPLOY ILLUMINEX POOLS
  // const vineRose = illuminexFactory.createPair("", "");
  // const vusdEthUSDC = illuminexFactory.createPair("", "");

  // TODO: Register receivers TroveManager/Lp token/USDC Pool
  // await vineVault.registerReceiver()

  // TOKEN VESTING CONFIG

  // TODO: decide the real values for mainnet for unlocking rule
  // await tokenVesting.setUnlockingRule({})

  // TOKEN LOCKER CONFIG
  // await tokenLocker.setPenaltyWithdrawalsEnabled(true);

  // TODO: lock tokens?
  // await tokenLocker.lock()
}

main()
  .then(() => console.log("Core contracts initilized"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
