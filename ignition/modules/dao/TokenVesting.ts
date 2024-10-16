import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";
import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";

export default (
  m: IgnitionModuleBuilder,
  bitCore: NamedArtifactContractDeploymentFuture<"BitCore">,
  bitVault: NamedArtifactContractDeploymentFuture<"BitVault">,
  bitToken: NamedArtifactContractDeploymentFuture<"BitToken">
) => {
  const tokenVesting = m.contract(
    "TokenVesting",
    [bitCore, bitVault, bitToken],
    { after: [bitCore, bitVault, bitToken] }
  );

  return tokenVesting;
};
