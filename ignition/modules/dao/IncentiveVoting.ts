import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  bitCore: NamedArtifactContractDeploymentFuture<"BitCore">
) => {
  const incentiveVoting = m.contract("IncentiveVoting", [bitCore], {
    after: [bitCore],
  });

  return incentiveVoting;
};
