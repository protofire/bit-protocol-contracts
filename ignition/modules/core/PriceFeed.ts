import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

// MAINNET
const bandProtocolAddr = "0xDA7a001b254CD22e46d3eAB04d937489c93174C3";

// TESTNET
// const bandProtocolAddr = "0x0c2362c9A0586Dd7295549C65a4A5e3aFE10a88A";

const oracle = {
  token: "0xB5EA3151e1edED183CC9571916B435b6B188D508",
  base: "wBTC",
  quote: "USD",
  heartbeat: 86400,
};

export default (
  m: IgnitionModuleBuilder,
  vineCore: NamedArtifactContractDeploymentFuture<"VineCore">,
  mockBand?: NamedArtifactContractDeploymentFuture<"LPPriceOracle">
) => {
  let priceFeed;
  if (mockBand) {
    priceFeed = m.contract(
      "PriceFeed",
      [vineCore, [{ ...oracle, band: mockBand }]],
      { after: [vineCore, mockBand] }
    );
  } else {
    priceFeed = m.contract(
      "PriceFeed",
      [vineCore, [{ ...oracle, band: bandProtocolAddr }]],
      { after: [vineCore] }
    );
  }

  return priceFeed;
};
