import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  stabilityPool: NamedArtifactContractDeploymentFuture<"StabilityPool">,
  borrowerOps: NamedArtifactContractDeploymentFuture<"BorrowerOperations">,
  factory: NamedArtifactContractDeploymentFuture<"Factory">
) => {
  const gasCompensation = m.getParameter(
    "gasCompensation",
    "1000000000000000000"
  );

  const liquidationManager = m.contract(
    "LiquidationManager",
    [stabilityPool, borrowerOps, factory, gasCompensation],
    { after: [stabilityPool, borrowerOps, factory] }
  );

  return liquidationManager;
};
