import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  factory: NamedArtifactContractDeploymentFuture<"Factory">
) => {
  const troveManagerGetters = m.contract("TroveManagerGetters", [factory], {
    after: [factory],
  });

  return troveManagerGetters;
};
