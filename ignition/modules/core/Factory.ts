import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  bitCore: NamedArtifactContractDeploymentFuture<"BitCore">,
  debtToken: NamedArtifactContractDeploymentFuture<"DebtToken">
) => {
  const factory = m.contract("Factory", [bitCore, debtToken], {
    after: [bitCore, debtToken],
  });

  return factory;
};
