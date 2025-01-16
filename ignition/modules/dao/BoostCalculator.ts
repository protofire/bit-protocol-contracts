import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  bitCore: NamedArtifactContractDeploymentFuture<"BitCore">,
  tokenLocker: NamedArtifactContractDeploymentFuture<"TokenLocker">
) => {
  // TODO: make sure the value is 2
  const graceWeeks = m.getParameter("graceWeeks", 2);

  const boostCalculator = m.contract(
    "BoostCalculator",
    [bitCore, tokenLocker, graceWeeks],
    { after: [bitCore, tokenLocker] }
  );

  return boostCalculator;
};
