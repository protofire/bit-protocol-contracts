import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

const OWNER_ADDRESS =
  process.env.NETWORK === "localhost"
    ? "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    : process.env.PUBLIC_KEY;

const GUARDIAN_ADDRESS =
  process.env.NETWORK === "localhost"
    ? "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    : process.env.PUBLIC_KEY;

export default (m: IgnitionModuleBuilder) => {
  const owner = m.getParameter("owner", OWNER_ADDRESS);
  const guardian = m.getParameter("owner", GUARDIAN_ADDRESS);
  // We use a placeholder address for priceFeed at the deployment time
  const priceFeed = m.getParameter("priceFeed", OWNER_ADDRESS);
  // We use a placeholder address for feeReceiver at the deployment time
  const feeReceiver = m.getParameter("feeReceiver", OWNER_ADDRESS);

  const vineCore = m.contract("VineCore", [
    owner,
    guardian,
    priceFeed,
    feeReceiver,
  ]);

  return vineCore;
};
