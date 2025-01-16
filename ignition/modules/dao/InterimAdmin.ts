import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  bitCore: NamedArtifactContractDeploymentFuture<"BitCore">
) => {
  const interimAdmin = m.contract("InterimAdmin", [bitCore], {
    after: [bitCore],
    from: process.env.PUBLIC_KEY,
  });

  return interimAdmin;
};
