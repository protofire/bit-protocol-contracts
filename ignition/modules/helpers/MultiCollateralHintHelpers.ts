import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  borrowerOperations: NamedArtifactContractDeploymentFuture<"BorrowerOperations">
) => {
  const gasCompensation = m.getParameter(
    "gasCompensation",
    "1000000000000000000"
  );

  const multiCollateralHintHelpers = m.contract(
    "MultiCollateralHintHelpers",
    [borrowerOperations, gasCompensation],
    { after: [borrowerOperations] }
  );

  return multiCollateralHintHelpers;
};
