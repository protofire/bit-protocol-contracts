import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

// MAINNET
const bandProtocolAddr = "0xDA7a001b254CD22e46d3eAB04d937489c93174C3";

const oracle = {
  token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  base: "ROSE",
  quote: "USD",
  heartbeat: 86400,
};

export default (
  m: IgnitionModuleBuilder,
  bitCore: NamedArtifactContractDeploymentFuture<"BitCore">,
  mockBand?: NamedArtifactContractDeploymentFuture<"LPPriceOracle">
) => {
  let priceFeed;
  if (mockBand) {
    priceFeed = m.contract(
      "PriceFeed",
      [bitCore, [{ ...oracle, band: mockBand }]],
      { after: [bitCore, mockBand] }
    );
  } else {
    priceFeed = m.contract(
      "PriceFeed",
      [bitCore, [{ ...oracle, band: bandProtocolAddr }]],
      { after: [bitCore] }
    );
  }

  return priceFeed;
};
