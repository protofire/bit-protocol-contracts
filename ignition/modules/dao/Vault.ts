import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

const adminPublicAddress =
  process.env.NETWORK === "localhost"
    ? "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    : process.env.PUBLIC_KEY;

export default (
  m: IgnitionModuleBuilder,
  vineCore: NamedArtifactContractDeploymentFuture<"VineCore">,
  vineToken: NamedArtifactContractDeploymentFuture<"VineToken">,
  locker: NamedArtifactContractDeploymentFuture<"TokenLocker">,
  voter: NamedArtifactContractDeploymentFuture<"IncentiveVoting">,
  stabilityPool: NamedArtifactContractDeploymentFuture<"StabilityPool">
) => {
  const manager = m.getParameter("manager", adminPublicAddress);

  const vault = m.contract(
    "VineVault",
    [vineCore, vineToken, locker, voter, stabilityPool, manager],
    { after: [vineCore, vineToken, locker, stabilityPool, voter] }
  );

  return vault;
};
