import { ethers } from "hardhat";
import fs from "fs";

// vine token
// vesting
// lock
// lp providers
// vine stakers
// how much rose locked in the protocol

// vesting contracts, the VINE Token lp providers, the stability pool providers, and the vine token
// VINE tokens each user has a right to for the new governance token redistribution
// vUSD holders and ROSE locked in the system

const tokenLocker = "0x8E0f121DC898022815B758E73D9Baa7f5876A4C1";
const vineToken = "0xCC34EBcB6ecD87754380C811BdD8b6A35be40dd7";
const addressToSkip = "0xfD2B5211a81a59B0BFeF391E84BaBfC60689B631";

const addressZero = "0x0000000000000000000000000000000000000000";
const INITIAL_CHUNK_SIZE = 100;
let START_BLOCK = 2744273;

const main = async () => {
  try {
    const [deployer] = await ethers.getSigners();

    const contract = await ethers.getContractAt(
      "BitToken",
      vineToken,
      deployer
    );

    // const tokenLockerCt = await ethers.getContractAt(
    //   "TokenLocker",
    //   tokenLocker,
    //   deployer
    // );

    const transferEvent = contract.filters.Transfer();

    const latestBlock = await ethers.provider.getBlockNumber();
    const holders = new Set<string>();

    let chunkSize = INITIAL_CHUNK_SIZE;

    for (START_BLOCK; START_BLOCK <= latestBlock; START_BLOCK += chunkSize) {
      let endBlock = Math.min(START_BLOCK + chunkSize - 1, latestBlock);

      while (true) {
        try {
          const transferEvents = await contract.queryFilter(
            transferEvent,
            START_BLOCK,
            endBlock
          );
          console.log("block", { START_BLOCK, endBlock });
          transferEvents.forEach((event) => {
            // const fromAddress = event.args?.from;
            // if (fromAddress === addressToSkip) {
            //   console.log(`Skipping address: ${fromAddress}`);
            //   return; // Skip this address
            // }
            console.log("Depositor: ", event.args?.from);
            holders.add(event.args?.from);
            holders.add(event.args?.to);
          });

          // Break out of the retry loop if successful
          break;
        } catch (error) {
          console.log(error);
          console.log(
            `Block range limit exceeded, reducing chunk size to ${chunkSize}/${endBlock}`
          );
        }
      }
    }

    // Remove the zero address
    holders.delete(addressZero);

    console.log("Token Holders and Balances:");
    let csv = "Address, Collateral Gains\n";
    for (const holder of holders) {
      // const accountData = await tokenLockerCt.getAccountBalances(holder);
      // console.log("accountData: ", accountData);
      // csv += `${holder}, ${accountData[0]}, ${accountData[1]}\n`;
      const balance = await contract.balanceOf(holder);
      if (balance > 0) {
        csv += `${holder}, ${ethers.formatUnits(balance, 18)}\n`;
        console.log(`${holder}: ${ethers.formatUnits(balance, 18)}`);
      }
    }
    fs.writeFileSync("./vineHolders.csv", csv, "utf-8");
  } catch (error) {
    console.log(error);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
