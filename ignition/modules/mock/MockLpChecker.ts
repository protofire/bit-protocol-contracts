import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (m: IgnitionModuleBuilder) => {
  const mockLpChecker = m.contract("LpChecker", []);

  return mockLpChecker;
};
