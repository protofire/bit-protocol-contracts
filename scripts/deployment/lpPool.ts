import hre, { ethers } from "hardhat";
import { Wallet } from "ethers";

const NETWORK = process.env.NETWORK || "localhost";

const { adminPrivateKey } = require(`../config/${NETWORK}.ts`);
const { contracts } = require("../config/index.ts");

const wRose = "0x8bc2b030b299964eefb5e1e0b36991352e56d2d3";
const ethUSDC = "0xf170d8b2e7280a495af181ade4c18f67befd9941";

async function main() {
  const adminWallet = new Wallet(adminPrivateKey, hre.ethers.provider);

  const signer = await hre.ethers.getSigner(adminWallet.address);

  const illuminexFactory = await hre.ethers.getContractAt(
    "LuminexV1Factory",
    "0x045551B6A4066db850A1160B8bB7bD9Ce3A2B5A5",
    signer
  );

  // DEPLOY ILLUMINEX POOLS
  const txVineRoseLP = await illuminexFactory.createPair(
    wRose,
    contracts["VineToken"].address
  );
  const txVusdEthUSDCLP = await illuminexFactory.createPair(
    contracts["DebtToken"].address,
    ethUSDC
  );

  await txVineRoseLP.wait();
  await txVusdEthUSDCLP.wait();

  const vineRoseLP = await illuminexFactory.getPair(
    wRose,
    contracts["VineToken"].address
  );
  const vusdEthUSDCLP = await illuminexFactory.getPair(
    contracts["DebtToken"].address,
    ethUSDC
  );

  console.log({
    vineRoseLP,
    vusdEthUSDCLP,
  });
}

main()
  .then(() => console.log("LP pools contracts deployed"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
