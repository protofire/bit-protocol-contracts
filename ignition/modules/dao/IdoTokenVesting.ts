import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";
import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";

export default (
  m: IgnitionModuleBuilder,
  bitCore: NamedArtifactContractDeploymentFuture<"BitCore">,
  bitVault: NamedArtifactContractDeploymentFuture<"BitVault">,
  bitToken: NamedArtifactContractDeploymentFuture<"BitToken">
) => {
  const idoTokenVesting = m.contract(
    "IDOTokenVesting",
    [bitCore, bitVault, bitToken, 1723569512, 15552000],
    { after: [bitCore, bitVault, bitToken] }
  );

  return idoTokenVesting;
};
