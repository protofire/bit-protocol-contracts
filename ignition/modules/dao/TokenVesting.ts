import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";
import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";

export default (
  m: IgnitionModuleBuilder,
  vineCore: NamedArtifactContractDeploymentFuture<"VineCore">,
  vineVault: NamedArtifactContractDeploymentFuture<"VineVault">,
  vineToken: NamedArtifactContractDeploymentFuture<"VineToken">
) => {
  const tokenVesting = m.contract(
    "TokenVesting",
    [vineCore, vineVault, vineToken],
    { after: [vineCore, vineVault, vineToken] }
  );

  return tokenVesting;
};
