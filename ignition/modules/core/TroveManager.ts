import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  bitCore: NamedArtifactContractDeploymentFuture<"BitCore">,
  gasPool: NamedArtifactContractDeploymentFuture<"GasPool">,
  debtToken: NamedArtifactContractDeploymentFuture<"DebtToken">,
  borrowerOps: NamedArtifactContractDeploymentFuture<"BorrowerOperations">,
  vault: NamedArtifactContractDeploymentFuture<"BitVault">,
  liqManager: NamedArtifactContractDeploymentFuture<"LiquidationManager">
) => {
  const gasCompensation = m.getParameter(
    "gasCompensation",
    "1000000000000000000"
  );

  const troveManager = m.contract(
    "TroveManager",
    [
      bitCore,
      gasPool,
      debtToken,
      borrowerOps,
      vault,
      liqManager,
      gasCompensation,
    ],
    { after: [bitCore, gasPool, debtToken, borrowerOps, vault, liqManager] }
  );

  return troveManager;
};
