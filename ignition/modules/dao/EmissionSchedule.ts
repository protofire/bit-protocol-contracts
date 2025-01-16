import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  bitCore: NamedArtifactContractDeploymentFuture<"BitCore">,
  voter: NamedArtifactContractDeploymentFuture<"IncentiveVoting">,
  vault: NamedArtifactContractDeploymentFuture<"BitVault">
) => {
  // const initialLockWeeks = m.getParameter("initialLockWeeks", 26);
  // TODO
  const initialLockWeeks = m.getParameter("initialLockWeeks", 0);
  const lockDecayWeeks = m.getParameter("lockDecayWeeks", 2);
  const weeklyPct = m.getParameter("weeklyPct", 140);
  const scheduledWeeklyPct = m.getParameter("scheduledWeeklyPct", [
    [104, 40],
    [52, 60],
    [26, 80],
    [12, 100],
    [4, 120],
  ]);

  const emissionSchedule = m.contract(
    "EmissionSchedule",
    [
      bitCore,
      voter,
      vault,
      initialLockWeeks,
      lockDecayWeeks,
      weeklyPct,
      scheduledWeeklyPct,
    ],
    { after: [bitCore, voter, vault] }
  );

  return emissionSchedule;
};
