import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

import { ethers } from "hardhat";

export default (m: IgnitionModuleBuilder) => {
  const multiTroveGetter = m.contract("MultiTroveGetter", []);

  return multiTroveGetter;
};

// const main = async () => {
//   const [deployer] = await ethers.getSigners();

//   const troveGetter = await ethers.getContractFactory(
//     "TroveManagerGetters",
//     deployer
//   );
//   const t = await troveGetter.deploy(
//     "0x5576141e4Ff85186AAF6433f8136b64467B88D8E"
//   );
//   await t.waitForDeployment();

//   console.log("TroveManagerGetters deployed to:", await t.getAddress());
// };

// main();
