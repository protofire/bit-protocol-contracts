import { ethers } from "hardhat";

// vine token
// vesting
// lock
// lp providers
// vine stakers
// how much rose locked in the protocol

// vesting contracts, the VINE Token lp providers, the stability pool providers, and the vine token
// VINE tokens each user has a right to for the new governance token redistribution
// vUSD holders and ROSE locked in the system

const vesting = "0xd50bD1DaEa59eF39f629aB186f8c66e33B2a4e1f";
const lpToken = "0x9327e5e12F79dC0363f754d95bc7Eec3BA356b8a";
const stability = "0xc2e73270A5Bb1000E8f91371Be09B1a033Ef0e40";
const debtToken = "0x9b439999b816eCc2B733f9889509157b7983B8C4";
const lp = "0x70A83aeA847676F820dA766d6e4975165E2fd852";

const addressZero = "0x0000000000000000000000000000000000000000";
const INITIAL_CHUNK_SIZE = 100;
let START_BLOCK = 2744527;

const holders = ["0x9327e5e12F79dC0363f754d95bc7Eec3BA356b8a"];

const main = async () => {
  try {
    const [deployer] = await ethers.getSigners();

    const contract = await ethers.getContractAt("BitToken", lp, deployer);

    const transferEvent = contract.filters.Transfer(
      undefined,
      "0x70A83aeA847676F820dA766d6e4975165E2fd852"
    );

    // const latestBlock = await ethers.provider.getBlockNumber();
    // const holders = new Set<string>();

    // let chunkSize = INITIAL_CHUNK_SIZE;

    // for (START_BLOCK; START_BLOCK <= latestBlock; START_BLOCK += chunkSize) {
    //   let endBlock = Math.min(START_BLOCK + chunkSize - 1, latestBlock);

    //   while (true) {
    //     try {
    //       const transferEvents = await contract.queryFilter(
    //         transferEvent,
    //         START_BLOCK,
    //         endBlock
    //       );

    //       transferEvents.forEach((event) => {
    //         console.log("Depositor: ", event.args?.from);
    //         holders.add(event.args?.from);
    //       });

    //       // Break out of the retry loop if successful
    //       break;
    //     } catch (error) {
    //       console.log(error);
    //       console.log(
    //         `Block range limit exceeded, reducing chunk size to ${chunkSize}/${endBlock}`
    //       );
    //     }
    //   }
    // }

    // // Remove the zero address
    // holders.delete(addressZero);

    console.log("Token Holders and Balances:");
    for (const holder of holders) {
      const balance = await contract.balanceOf(holder);
      console.log(`${holder}: ${ethers.formatUnits(balance, 18)}`);
    }
  } catch (error) {
    console.log(error);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
