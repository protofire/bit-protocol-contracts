import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

import { ethers } from "hardhat";

export default (m: IgnitionModuleBuilder) => {
  const multiTroveGetter = m.contract("MultiTroveGetter", []);

  return multiTroveGetter;
};
