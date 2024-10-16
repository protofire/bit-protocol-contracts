import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";
import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";

export default (
  m: IgnitionModuleBuilder,
  bitCore: NamedArtifactContractDeploymentFuture<"BitCore">
) => {
  const feeReceiver = m.contract("FeeReceiver", [bitCore], {
    after: [bitCore],
  });

  return feeReceiver;
};
