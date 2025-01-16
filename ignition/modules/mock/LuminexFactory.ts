import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

const feeSetter = process.env.PUBLIC_KEY || "";

export default (m: IgnitionModuleBuilder) => {
  const factory = m.contract("LuminexV1Factory", [
    feeSetter,
    "0x0000000000000000000000000000000000000000",
  ]);

  return factory;
};
