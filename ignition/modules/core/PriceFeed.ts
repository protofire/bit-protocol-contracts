import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

/* TODO: 
  add the correct band address
*/
const bandProtocolAddr = "0xDA7a001b254CD22e46d3eAB04d937489c93174C3";

const oracle = {
  token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  base: "ROSE",
  quote: "USD",
  heartbeat: 86400,
};

export default (
  m: IgnitionModuleBuilder,
  vineCore: NamedArtifactContractDeploymentFuture<"VineCore">,
  mockBand?: NamedArtifactContractDeploymentFuture<"LPPriceOracle">
) => {
  let priceFeed;
  // TODO: add the correct band address
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
