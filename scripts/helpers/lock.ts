import { ethers } from "hardhat";

// price1Avg = 509436468997379283468491692723118
// price0Avg = 52933305100604573444923078927762991

const main = async () => {
  try {
    const [deployer] = await ethers.getSigners();

    const tokenLocker = await ethers.getContractAt(
      "MockTwapOracle",
      "0xC73b089972B5a13ff37A7cB4a80FEB29eBC3eF8c",
      deployer
    );

    // await tokenLocker.setTokens(
    //   "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    //   "0xe8dDD8C301Ad6d8bE911DCdD9449C5E06C764db7"
    // );
    // await tokenLocker.setPriceAverages(
    //   "52933305100604573444923078927762991",
    //   "509436468997379283468491692723118"
    // );

    const price1 = await tokenLocker.consult(
      "0xe8dDD8C301Ad6d8bE911DCdD9449C5E06C764db7",
      "1000000000000000000"
    );
    const price0 = await tokenLocker.consult(
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      "1000000000000000000"
    );

    console.log("Done", {
      price1: ethers.formatUnits(price1, 18),
      price0: ethers.formatUnits(price0, 18),
    });
  } catch (error) {
    console.log("error", error);
  }
};

main();
