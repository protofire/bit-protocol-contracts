import { ethers } from "hardhat";

// price1Avg = 509436468997379283468491692723118
// price0Avg = 52933305100604573444923078927762991

const main = async () => {
  try {
    const [deployer] = await ethers.getSigners();

    const tokenLocker = await ethers.getContractAt(
      "MockTwapOracle",
      "0x793EA3ef890570f6935697CDc61f769a04Ed63C2",
      deployer
    );

    await tokenLocker.setTokens(
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      "0xDa687433844Dbd7D41a1ECc8bbdD0c1D43112716"
    );
    await tokenLocker.setPriceAverages(
      "52933305100604573444923078927762991",
      "509436468997379283468491692723118"
    );

    const price1 = await tokenLocker.consult(
      "0xDa687433844Dbd7D41a1ECc8bbdD0c1D43112716",
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
