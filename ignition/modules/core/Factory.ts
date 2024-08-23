import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  vineCore: NamedArtifactContractDeploymentFuture<"VineCore">,
  debtToken: NamedArtifactContractDeploymentFuture<"DebtToken">
) => {
  const factory = m.contract("Factory", [vineCore, debtToken], {
    after: [vineCore, debtToken],
  });

  return factory;
};
