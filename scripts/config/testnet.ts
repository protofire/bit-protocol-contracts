import addresses from "../../ignition/deployments/chain-23295/deployed_addresses.json";

const adminPrivateKey = process.env.PRIVATE_KEY;

module.exports = {
  adminPrivateKey,
  addresses,
};
