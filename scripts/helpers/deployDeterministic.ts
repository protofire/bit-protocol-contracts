import { ethers } from "hardhat";

// 0x8dE24f96EdEe3C06e1DcFD769F780CEECD342fB2

const main = async () => {
  try {
    const [deployer] = await ethers.getSigners();

    const Deterministic = await ethers.getContractFactory(
      "DeterministicDeploy"
    );

    const deterministic = await Deterministic.deploy();

    console.log("Deterministic address: ", await deterministic.getAddress());

    const creationBytecode = await deterministic.getCreationBytecode(
      "0x31C2cb2cd72a0a35Bf1839a2e0d383566bf904b0"
    );

    await deterministic.deploy(creationBytecode, deployer.address);

    deterministic.once("Deploy", async (address) => {
      console.log("Contract deployed at", address);
    });
  } catch (error) {
    console.log(error);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
