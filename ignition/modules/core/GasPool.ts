import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (m: IgnitionModuleBuilder) => {
  const gasPool = m.contract("GasPool", []);

  return gasPool;
};
