import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (m: IgnitionModuleBuilder) => {
  const factory = m.contract("MockTwapOracle", []);

  return factory;
};
