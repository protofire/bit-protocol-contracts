import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

/* TODO: 
  add the correct band address
*/
const bandProtocolAddr =
  process.env.NETWORK === "testnet"
    ? "0x4ed7c70f96b99c776995fb64377f0d4ab3b0e1c1"
    : "0x4ed7c70f96b99c776995fb64377f0d4ab3b0e1c1";

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

  if (process.env.NETWORK === "localhost" && mockBand) {
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
