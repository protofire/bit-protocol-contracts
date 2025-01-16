import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  vault: NamedArtifactContractDeploymentFuture<"BitVault">,
  trove: NamedArtifactContractDeploymentFuture<"TroveManager">,
  bitCore: NamedArtifactContractDeploymentFuture<"BitCore">
) => {
  const stakeLPToken = m.contract("StakeLPToken", [vault, trove, bitCore], {
    after: [vault, trove, bitCore],
  });

  return stakeLPToken;
};
