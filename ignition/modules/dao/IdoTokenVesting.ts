import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";
import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";

export default (
  m: IgnitionModuleBuilder,
  vineCore: NamedArtifactContractDeploymentFuture<"VineCore">,
  vineVault: NamedArtifactContractDeploymentFuture<"VineVault">,
  vineToken: NamedArtifactContractDeploymentFuture<"VineToken">
) => {
  const idoTokenVesting = m.contract(
    "IDOTokenVesting",
    [vineCore, vineVault, vineToken, 1723569512, 15552000],
    { after: [vineCore, vineVault, vineToken] }
  );

  return idoTokenVesting;
};
