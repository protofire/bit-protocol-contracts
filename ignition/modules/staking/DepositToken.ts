import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  vault: NamedArtifactContractDeploymentFuture<"VineVault">,
  trove: NamedArtifactContractDeploymentFuture<"TroveManager">,
  vineCore: NamedArtifactContractDeploymentFuture<"VineCore">
) => {
  const depositToken = m.contract("DepositToken", [vault, trove, vineCore], {
    after: [vault, trove, vineCore],
  });

  return depositToken;
};
