import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  vineCore: NamedArtifactContractDeploymentFuture<"VineCore">,
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
    [vineCore, debtToken, factory, minNetDebt, gasCompensation],
    { after: [vineCore, debtToken, factory] }
  );

  return borrowerOperations;
};
