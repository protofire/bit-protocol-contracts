import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

const OWNER_ADDRESS = process.env.PUBLIC_KEY;

export default (m: IgnitionModuleBuilder) => {
  const price = m.getParameter("price", "1000000000000000000");

  const mockBand = m.contract("LPPriceOracle", [price]);

  return mockBand;
};
