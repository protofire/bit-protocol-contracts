import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  vineCore: NamedArtifactContractDeploymentFuture<"VineCore">
) => {
  const incentiveVoting = m.contract("IncentiveVoting", [vineCore], {
    after: [vineCore],
  });

  return incentiveVoting;
};
