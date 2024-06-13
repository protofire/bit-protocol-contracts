import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  vineCore: NamedArtifactContractDeploymentFuture<"VineCore">,
  voter: NamedArtifactContractDeploymentFuture<"IncentiveVoting">,
  vault: NamedArtifactContractDeploymentFuture<"VineVault">
) => {
  const initialLockWeeks = m.getParameter("initialLockWeeks", 19);
  const lockDecayWeeks = m.getParameter("lockDecayWeeks", 2);
  const weeklyPct = m.getParameter("weeklyPct", 100);
  const scheduledWeeklyPct = m.getParameter("scheduledWeeklyPct", [
    [104, 40],
    [52, 60],
    [26, 80],
  ]);

  const emissionSchedule = m.contract(
    "EmissionSchedule",
    [
      vineCore,
      voter,
      vault,
      initialLockWeeks,
      lockDecayWeeks,
      weeklyPct,
      scheduledWeeklyPct,
    ],
    { after: [vineCore, voter, vault] }
  );

  return emissionSchedule;
};
