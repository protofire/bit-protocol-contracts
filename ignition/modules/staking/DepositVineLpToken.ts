import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  bitToken: NamedArtifactContractDeploymentFuture<"BitToken">,
  lpToken: string,
  vault: NamedArtifactContractDeploymentFuture<"BitVault">,
  trove: NamedArtifactContractDeploymentFuture<"TroveManager">,
  bitCore: NamedArtifactContractDeploymentFuture<"BitCore">,
  oracle: string
) => {
  const depositBitLp = m.contract(
    "DepositBitLp",
    [bitToken, lpToken, vault, trove, bitCore, oracle],
    { after: [bitToken, vault, trove, bitCore] }
  );

  return depositBitLp;
};
