import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  vineToken: NamedArtifactContractDeploymentFuture<"VineToken">,
  lpToken: string,
  vault: NamedArtifactContractDeploymentFuture<"VineVault">,
  trove: NamedArtifactContractDeploymentFuture<"TroveManager">,
  vineCore: NamedArtifactContractDeploymentFuture<"VineCore">,
  oracle: string
) => {
  const depositVineLp = m.contract(
    "DepositVineLp",
    [vineToken, lpToken, vault, trove, vineCore, oracle],
    { after: [vineToken, vault, trove, vineCore] }
  );

  return depositVineLp;
};
