import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  vineCore: NamedArtifactContractDeploymentFuture<"VineCore">,
  debtToken: NamedArtifactContractDeploymentFuture<"DebtToken">,
  factory: NamedArtifactContractDeploymentFuture<"Factory">
) => {
  const stabilityPool = m.contract(
    "StabilityPool",
    [vineCore, debtToken, factory],
    {
      after: [vineCore, debtToken, factory],
    }
  );

  return stabilityPool;
};
