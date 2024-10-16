const NETWORK = process.env.NETWORK || "localhost";

const { addresses } = require(`./${NETWORK}.ts`);

const modulePreffix = "CoreModule#";

const priceFeed = `${modulePreffix}PriceFeed`;
const feeReceiver = `${modulePreffix}FeeReceiver`;
const bitCore = `${modulePreffix}BitCore`;
const debtToken = `${modulePreffix}DebtToken`;
const factory = `${modulePreffix}Factory`;
const gasPool = `${modulePreffix}GasPool`;
const stabilityPool = `${modulePreffix}StabilityPool`;
const borrowOps = `${modulePreffix}BorrowerOperations`;
const sortedTroves = `${modulePreffix}SortedTroves`;
const troveManager = `${modulePreffix}TroveManager`;
const liquidationManager = `${modulePreffix}LiquidationManager`;
const bitVault = `${modulePreffix}BitVault`;
const incentiveVoting = `${modulePreffix}IncentiveVoting`;
const tokenLocker = `${modulePreffix}TokenLocker`;
const emissionSchedule = `${modulePreffix}EmissionSchedule`;
const boostCalculator = `${modulePreffix}BoostCalculator`;
const bitToken = `${modulePreffix}BitToken`;
const tokenVesting = `${modulePreffix}TokenVesting`;
const interimAdmin = `${modulePreffix}InterimAdmin`;
const lpPriceOracle = `${modulePreffix}LPPriceOracle`;
const idoTokenVesting = `${modulePreffix}IDOTokenVesting`;
const multiTroveGetter = `${modulePreffix}MultiTroveGetter`;
const multiCollateralHintHelpers = `${modulePreffix}MultiCollateralHintHelpers`;
const troveManagerGetters = `${modulePreffix}TroveManagerGetters`;

const contracts = {
  PriceFeed: {
    address: addresses[priceFeed],
  },
  FeeReceiver: {
    address: addresses[feeReceiver],
  },
  BitCore: {
    address: addresses[bitCore],
  },
  DebtToken: {
    address: addresses[debtToken],
  },
  Factory: {
    address: addresses[factory],
  },
  GasPool: {
    address: addresses[gasPool],
  },
  StabilityPool: {
    address: addresses[stabilityPool],
  },
  BorrowerOperations: {
    address: addresses[borrowOps],
  },
  SortedTroves: {
    address: addresses[sortedTroves],
  },
  TroveManager: {
    address: addresses[troveManager],
  },
  LiquidationManager: {
    address: addresses[liquidationManager],
  },
  BitVault: {
    address: addresses[bitVault],
  },
  IncentiveVoting: {
    address: addresses[incentiveVoting],
  },
  TokenLocker: {
    address: addresses[tokenLocker],
  },
  EmissionSchedule: {
    address: addresses[emissionSchedule],
  },
  BoostCalculator: {
    address: addresses[boostCalculator],
  },
  BitToken: {
    address: addresses[bitToken],
  },
  TokenVesting: {
    address: addresses[tokenVesting],
  },
  LPPriceOracle: {
    address: addresses[lpPriceOracle],
  },
  IDOTokenVesting: {
    address: addresses[idoTokenVesting],
  },
  MultiTroveGetter: {
    address: addresses[multiTroveGetter],
  },
  MultiCollateralHintHelpers: {
    address: addresses[multiCollateralHintHelpers],
  },
  TroveManagerGetters: {
    address: addresses[troveManagerGetters],
  },
  // InterimAdmin: {
  //   address: addresses[interimAdmin],
  // },
};

module.exports = { contracts };
