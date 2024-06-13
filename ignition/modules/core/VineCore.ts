import { IgnitionModuleBuilder } from "@nomicfoundation/ignition-core/dist/src/types/module-builder";

const OWNER_ADDRESS = "0xe306605c97da3D5daFe9FeF56Cc95133E0Cb235C";
const GUARDIAN_ADDRESS = "0xe306605c97da3D5daFe9FeF56Cc95133E0Cb235C";

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
