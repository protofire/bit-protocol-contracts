import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  vineCore: NamedArtifactContractDeploymentFuture<"VineCore">,
  gasPool: NamedArtifactContractDeploymentFuture<"GasPool">,
  debtToken: NamedArtifactContractDeploymentFuture<"DebtToken">,
  borrowerOps: NamedArtifactContractDeploymentFuture<"BorrowerOperations">,
  vault: NamedArtifactContractDeploymentFuture<"VineVault">,
  liqManager: NamedArtifactContractDeploymentFuture<"LiquidationManager">
) => {
  const gasCompensation = m.getParameter(
    "gasCompensation",
    "1000000000000000000"
  );

  const troveManager = m.contract(
    "TroveManager",
    [
      vineCore,
      gasPool,
      debtToken,
      borrowerOps,
      vault,
      liqManager,
      gasCompensation,
    ],
    { after: [vineCore, gasPool, debtToken, borrowerOps, vault, liqManager] }
  );

  return troveManager;
};
