import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  bitCore: NamedArtifactContractDeploymentFuture<"BitCore">,
  debtToken: NamedArtifactContractDeploymentFuture<"DebtToken">,
  factory: NamedArtifactContractDeploymentFuture<"Factory">
) => {
  const stabilityPool = m.contract(
    "StabilityPool",
    [bitCore, debtToken, factory],
    {
      after: [bitCore, debtToken, factory],
    }
  );

  return stabilityPool;
};
