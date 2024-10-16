import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (
  m: IgnitionModuleBuilder,
  bitCore: NamedArtifactContractDeploymentFuture<"BitCore">
) => {
  const name = m.getParameter("name", "reBit USD");
  const symbol = m.getParameter("symbol", "rbitUSD");
  const gasCompensation = m.getParameter(
    "gasCompensation",
    "1000000000000000000"
  );

  const debtToken = m.contract(
    "DebtToken",
    [name, symbol, bitCore, gasCompensation],
    { after: [bitCore] }
  );

  return debtToken;
};
