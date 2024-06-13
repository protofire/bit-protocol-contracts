import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NETWORK = process.env.NETWORK;

export default buildModule("StakingModule", (m) => {
  if (NETWORK !== "mainnet") return;
});
