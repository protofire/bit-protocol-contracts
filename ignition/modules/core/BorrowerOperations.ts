import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  bitCore: NamedArtifactContractDeploymentFuture<"BitCore">,
  debtToken: NamedArtifactContractDeploymentFuture<"DebtToken">,
  factory: NamedArtifactContractDeploymentFuture<"Factory">
) => {
  const minNetDebt = m.getParameter("minNetDebt", "10000000000000000000");
  const gasCompensation = m.getParameter(
    "gasCompensation",
    "1000000000000000000"
  );

  const borrowerOperations = m.contract(
    "BorrowerOperations",
    [bitCore, debtToken, factory, minNetDebt, gasCompensation],
    { after: [bitCore, debtToken, factory] }
  );

  return borrowerOperations;
};
