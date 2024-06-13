import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

// TODO
const MANAGER_ADDRESS = "0xe306605c97da3D5daFe9FeF56Cc95133E0Cb235C";

export default (
  m: IgnitionModuleBuilder,
  vineCore: NamedArtifactContractDeploymentFuture<"VineCore">,
  vineToken: NamedArtifactContractDeploymentFuture<"VineToken">,
  voter: NamedArtifactContractDeploymentFuture<"IncentiveVoting">
) => {
  const manager = m.getParameter("manager", MANAGER_ADDRESS);
  const lockToTokenRatio = m.getParameter(
    "lockToTokenRatio",
    "1000000000000000000"
  );

  const tokenLocker = m.contract(
    "TokenLocker",
    [vineCore, vineToken, voter, manager, lockToTokenRatio],
    {
      after: [vineCore, vineToken, voter],
    }
  );

  return tokenLocker;
};
