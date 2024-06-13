import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

// TODO
const MANAGER_ADDRESS = "0xe306605c97da3D5daFe9FeF56Cc95133E0Cb235C";

export default (
  m: IgnitionModuleBuilder,
  vineCore: NamedArtifactContractDeploymentFuture<"VineCore">,
  vineToken: NamedArtifactContractDeploymentFuture<"VineToken">,
  locker: NamedArtifactContractDeploymentFuture<"TokenLocker">,
  voter: NamedArtifactContractDeploymentFuture<"IncentiveVoting">,
  stabilityPool: NamedArtifactContractDeploymentFuture<"StabilityPool">
) => {
  const manager = m.getParameter("manager", MANAGER_ADDRESS);

  const vault = m.contract(
    "VineVault",
    [vineCore, vineToken, locker, voter, stabilityPool, manager],
    { after: [vineCore, vineToken, locker, stabilityPool, voter] }
  );

  return vault;
};
