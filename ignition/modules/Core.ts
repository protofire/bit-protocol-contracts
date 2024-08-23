import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import {
  wrapEthersSigner,
  wrapEthersProvider,
  wrap,
} from "@oasisprotocol/sapphire-paratime";

import deployVineToken from "./dao/VineToken";
import deployVineCore from "./core/VineCore";
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
import deployMockLpChecker from "./mock/MockLpChecker";
import deployMockLpToken from "./mock/MockLpToken";

const NETWORK = process.env.NETWORK;

export default buildModule("CoreModule", (m) => {
  const vineCore = deployVineCore(m);

  if (NETWORK !== "sapphire") {
    // deployMockLpChecker(m);
    // deployMockLpToken();
    const mockBand = deployMockBand(m);
    deployPriceFeed(m, vineCore, mockBand);
  } else {
    deployPriceFeed(m, vineCore);
  }

  const vineToken = deployVineToken(m, vineCore);
  const feeReceiver = deployFeeReceiver(m, vineCore);
  const gasPool = deployGasPool(m);
  const debtToken = deployDebtToken(m, vineCore);
  const factory = deployFactory(m, vineCore, debtToken);
  const stabilityPool = deployStabilityPool(m, vineCore, debtToken, factory);
  const borrowerOps = deployBorrowerOps(m, vineCore, debtToken, factory);
  const liqManager = deployLiqManager(m, stabilityPool, borrowerOps, factory);
  const incentiveVoting = deployIncentiveVoting(m, vineCore);
  const tokenLocker = deployTokenLocker(
    m,
    vineCore,
    vineToken,
    incentiveVoting
  );
  const vault = deployVault(
    m,
    vineCore,
    vineToken,
    tokenLocker,
    incentiveVoting,
    stabilityPool
  );
  const troveManager = deployTroveManager(
    m,
    vineCore,
    gasPool,
    debtToken,
    borrowerOps,
    vault,
    liqManager
  );
  const sortedTroves = deploySortedTroves(m);
  const emissionSchedule = deployEmissionSchedule(
    m,
    vineCore,
    incentiveVoting,
    vault
  );
  const boostCalculator = deployBoostCalculator(m, vineCore, tokenLocker);
  // const interimAdmin = deployInterimAdmin(m, vineCore);

  const multiCollHintHelpers = deployMultiCollHintHelpers(m, borrowerOps);
  const multiTroveGetter = deployMultiTroveGetter(m);
  const troveManagerGetters = deployTroveManagerGetters(m, factory);
  const idoTokenVesting = deployIdoTokenVesting(m, vineCore, vault, vineToken);
  deployTokenVesting(m, vineCore, vault, vineToken);

  return { vineCore };
});
