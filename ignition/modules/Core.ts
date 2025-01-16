import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import deployBitToken from "./dao/BitToken";
import deployBitCore from "./core/BitCore";
import deployFeeReceiver from "./dao/FeeReceiver";
import deployPriceFeed from "./core/PriceFeed";
import deployGasPool from "./core/GasPool";
import deployDebtToken from "./core/DebtToken";
import deployFactory from "./core/Factory";
import deployStabilityPool from "./core/StabilityPool";
import deployBorrowerOps from "./core/BorrowerOperations";
import deployLiqManager from "./core/LiquidationManager";
import deployIncentiveVoting from "./dao/IncentiveVoting";
import deployTokenLocker from "./dao/TokenLocker";
import deployVault from "./dao/Vault";
import deployTroveManager from "./core/TroveManager";
import deploySortedTroves from "./core/SortedTroves";
import deployEmissionSchedule from "./dao/EmissionSchedule";
import deployBoostCalculator from "./dao/BoostCalculator";
// import deployInterimAdmin from "./dao/InterimAdmin";
import deployMultiCollHintHelpers from "./helpers/MultiCollateralHintHelpers";
import deployMultiTroveGetter from "./helpers/MultiTroveGetter";
import deployTroveManagerGetters from "./helpers/TroveManagerGetters";
import deployIdoTokenVesting from "./dao/IdoTokenVesting";
import deployTokenVesting from "./dao/TokenVesting";

// Mocks
import deployMockBand from "./mock/MockBand";
import deployMockTwap from "./mock/MockTWAP";
import deployMockLpChecker from "./mock/MockLpChecker";

const NETWORK = process.env.NETWORK;

export default buildModule("CoreModule", (m) => {
  const bitCore = deployBitCore(m);

  if (NETWORK === "testnet") {
    deployMockTwap(m);
    const mockBand = deployMockBand(m);
    deployPriceFeed(m, bitCore, mockBand);
  } else {
    deployPriceFeed(m, bitCore);
  }

  const bitToken = deployBitToken(m, bitCore);
  deployFeeReceiver(m, bitCore);
  const gasPool = deployGasPool(m);
  const debtToken = deployDebtToken(m, bitCore);
  const factory = deployFactory(m, bitCore, debtToken);
  const stabilityPool = deployStabilityPool(m, bitCore, debtToken, factory);
  const borrowerOps = deployBorrowerOps(m, bitCore, debtToken, factory);
  const liqManager = deployLiqManager(m, stabilityPool, borrowerOps, factory);
  const incentiveVoting = deployIncentiveVoting(m, bitCore);
  const tokenLocker = deployTokenLocker(m, bitCore, bitToken, incentiveVoting);
  const vault = deployVault(
    m,
    bitCore,
    bitToken,
    tokenLocker,
    incentiveVoting,
    stabilityPool
  );
  deployTroveManager(
    m,
    bitCore,
    gasPool,
    debtToken,
    borrowerOps,
    vault,
    liqManager
  );
  deploySortedTroves(m);
  deployEmissionSchedule(m, bitCore, incentiveVoting, vault);
  // deployBoostCalculator(m, bitCore, tokenLocker);

  // LEAVE COMMENTED OUT FOR NOW
  // const interimAdmin = deployInterimAdmin(m, bitCore);

  deployMultiCollHintHelpers(m, borrowerOps);
  deployMultiTroveGetter(m);
  deployTroveManagerGetters(m, factory);
  // deployIdoTokenVesting(m, bitCore, vault, bitToken);
  // deployTokenVesting(m, bitCore, vault, bitToken);

  return { bitCore };
});
