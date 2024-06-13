import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  vineCore: NamedArtifactContractDeploymentFuture<"VineCore">
) => {
  const name = m.getParameter("name", "reVine USD");
  const symbol = m.getParameter("symbol", "rvUSD");
  const gasCompensation = m.getParameter(
    "gasCompensation",
    "10000000000000000000"
  );

  const debtToken = m.contract(
    "DebtToken",
    [name, symbol, vineCore, gasCompensation],
    { after: [vineCore] }
  );

  return debtToken;
};
