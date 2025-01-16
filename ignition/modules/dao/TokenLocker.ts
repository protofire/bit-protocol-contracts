import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

const MANAGER_ADDRESS = process.env.PUBLIC_KEY;

export default (
  m: IgnitionModuleBuilder,
  bitCore: NamedArtifactContractDeploymentFuture<"BitCore">,
  bitToken: NamedArtifactContractDeploymentFuture<"BitToken">,
  voter: NamedArtifactContractDeploymentFuture<"IncentiveVoting">
) => {
  const manager = m.getParameter("manager", MANAGER_ADDRESS);
  const lockToTokenRatio = m.getParameter(
    "lockToTokenRatio",
    "1000000000000000000"
  );

  const tokenLocker = m.contract(
    "TokenLocker",
    [bitCore, bitToken, voter, manager, lockToTokenRatio],
    {
      after: [bitCore, bitToken, voter],
    }
  );

  return tokenLocker;
};
