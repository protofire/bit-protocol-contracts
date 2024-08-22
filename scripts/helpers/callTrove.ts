import { ethers } from "hardhat";

// 0x94Bd7bFDCAe6Cc36455d8bf2FF9238BB1162E507

const main = async () => {
  try {
    const [deployer] = await ethers.getSigners();
    const time = Math.floor(new Date().getTime() / 1000);
    const user = await deployer.getAddress();

    const troveMGetter = await ethers.getContractAt(
      "TroveManagerGetters",
      "0x94Bd7bFDCAe6Cc36455d8bf2FF9238BB1162E507",
      deployer
    );

    const troveM = await ethers.getContractAt(
      "TroveManager",
      "0x562f2b88a22c6c01E8A1c88B26Dc3a64Fca3A10d",
      deployer
    );

    const signature = await deployer.signTypedData(
      {
        name: "VineSignature.SignIn",
        version: "1",
        chainId: 23295,
        verifyingContract: "0x94Bd7bFDCAe6Cc36455d8bf2FF9238BB1162E507",
      },
      {
        SignIn: [
          { name: "user", type: "address" },
          { name: "time", type: "uint32" },
        ],
      },
      {
        user,
        time,
      }
    );

    const rsv = ethers.Signature.from(signature);
    const auth = { user, time, rsv };

    const trove = await troveMGetter.getTrove(
      auth,
      "0x562f2b88a22c6c01E8A1c88B26Dc3a64Fca3A10d"
    );

    // const trove = await troveM.getTrove(
    //   "0xc92a6f28c63f3e244ca73b045529b29bd9943424"
    // );

    console.log({ trove });
  } catch (error) {
    console.log(error);
  }
};

main();

// {
//   user: "0xc92a6f28c63f3e244ca73b045529b29bd9943424",
//   time: 1722360224,
//   rsv: {
//     r: "0x46ee465249a0971498b8aad42d0ff7a3b82227181df5bd1292404111893ab6b4",
//     s: "0x1357214fb768378122021af08fc24f2783aba2cd81af954342d9d944c994b5b7",
//     v: 28,
//   },
// },
