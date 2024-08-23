import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  vineCore: NamedArtifactContractDeploymentFuture<"VineCore">,
  tokenLocker: NamedArtifactContractDeploymentFuture<"TokenLocker">
) => {
  // TODO: make sure the value is 2
  const graceWeeks = m.getParameter("graceWeeks", 2);

  const boostCalculator = m.contract(
    "BoostCalculator",
    [vineCore, tokenLocker, graceWeeks],
    { after: [vineCore, tokenLocker] }
  );

  return boostCalculator;
};
