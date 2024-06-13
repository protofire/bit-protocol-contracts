import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (m: IgnitionModuleBuilder) => {
  const price = m.getParameter("price", 100);

  const mockBand = m.contract("LPPriceOracle", [price]);

  return mockBand;
};
