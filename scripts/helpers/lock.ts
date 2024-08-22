import { ethers } from "hardhat";

const main = async () => {
  try {
    const [deployer] = await ethers.getSigners();

    const tokenLocker = await ethers.getContractAt(
      "TokenLocker",
      "0x3A2c1D25c2F97E144d43d6B421022F976FcB3D09",
      deployer
    );

    const lock = await tokenLocker.lock(
      "0xf51a2793842a58c0fdC2B9cCB55Bb4436f6B35Ae",
      "200000000000000000000000",
      52
    );

    console.log({ lock });
  } catch (error) {
    console.log("error", error);
  }
};

main();
