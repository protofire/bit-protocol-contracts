import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

export default (m: IgnitionModuleBuilder) => {
  const pool = m.contract("LuminexV1PairIX", [
    "0x0000000000000000000000000000000000000000",
  ]);

  return pool;
};
