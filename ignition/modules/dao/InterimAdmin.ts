import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  vineCore: NamedArtifactContractDeploymentFuture<"VineCore">
) => {
  const interimAdmin = m.contract("InterimAdmin", [vineCore], {
    after: [vineCore],
    from: process.env.PUBLIC_KEY,
  });

  return interimAdmin;
};
