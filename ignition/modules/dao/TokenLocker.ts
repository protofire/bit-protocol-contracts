import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

// TODO
// const MANAGER_ADDRESS =
//   process.env.NETWORK === "localhost"
//     ? "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
//     : process.env.PUBLIC_KEY;

const MANAGER_ADDRESS = process.env.PUBLIC_KEY;

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
