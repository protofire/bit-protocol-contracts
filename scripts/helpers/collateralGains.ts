import { ethers } from "hardhat";

import fs from "fs";

const collateralGainsByDepositor: { [key: string]: string } = {};

let sum = BigInt(0);

const addresses = [
  "0xa27112839f468b59866b7dad4d6ffbb3eba625ac",
  "0xed5c0ec452cd2c41817a770757f5bbad45877f90",
  "0x9bbd1037448369ed73482d72852371060e2800b2",
  "0x9812bc2540417e38d1de6a7e7a5c75d7e1b32f3f",
  "0x0d349331310abd72872da19cf4e4980a79105d49",
  "0x7457093dc138cf3f1d474985c5f7c0040a178dcd",
  "0x5762a9c5e55b1c6954c599df90b5b61ed10b3226",
  "0xd9eea8a09166780f38c393341cf7f3aae5a06321",
  "0x5e67f6bfad6e758a610abf0601ead439a4d93288",
  "0x8f91da09013f9091bca847f3758c1a26c78fee7d",
  "0xc504c188a8640dbb0a4eabcbc243bfad007cf756",
  "0xf4e08c22fc9dda3c654fef5b8f303334c46fccde",
  "0x7f978a67c651c16bcfaa29b6c82f6082d70b25d5",
  "0x1f4ac87bc9144bc83c4bcfd717693726f8128955",
  "0x2f298db3eda6542ebb5e9c819939b247d1b2bf77",
  "0xd359fa6ecbc25932965e07dca6bec6efc5ef838c",
  "0x071221e623328d5dd1e42eb445f914a0bb2922d0",
  "0xcd5f1407a87533fe09700068fea857d6ca3a0f15",
  "0x2d924a367f1a7950575cad2ccafc8f536424169d",
  "0x9857eadda114416286d466358dee918bdab4110c",
  "0x25871ac56a7f752f15f2a1093540f9d643bcbec4",
  "0x0e21c9752266c0b41b45545b4557fe602961f291",
  "0x162ef408d73b39e122d5b00deec2a4bc68fcc677",
  "0xccc49b604a20625a0bf8dc2f1944bd9aa537f99e",
  "0x34f3dbe9c847c39f34230adf426f3abe64a4da99",
  "0x0d0a38e64ed3fb480f42d9b15d0cb8de7b77a7bd",
  "0x748165407015ee13e57b61e517ae45808db9d6d2",
  "0xbfec7edc739b33e6c5c615e3cf34e7fb5d266793",
  "0xb71cde48e96178e5459ba3c39cce17420bc0335f",
  "0x2a5ec075a1c70bac1e7151c366d991022a0998e1",
  "0x396f8cda2825abb6d0c37e631bad4ca01b24d2d3",
  "0xaa4b5c729038a12fec4d5278ff55fa62fac81e56",
  "0x927360bae42c7f05b8cb2f39bca635a9db6545f9",
  "0x3af52415f71e404e5a09094eeece703d36c49c27",
  "0xb2eeb70db0d62307cdbc1442fd4411fe75fd3cf0",
  "0x0af118b5d84994e3f14a21a78e156588c220f670",
  "0x49d06dccd42db9ea8720e91ea2a5a9f25e15f5e5",
  "0xcd893160c854a8e4efa1bc648e9719d2cee64e66",
  "0x521da68a789c12e39d7d6f8a951138d3d9c94e9d",
  "0x88647dea9cc17a273901031bab13df99f120a726",
  "0x75b170117d16946bec474409675a97ae6d81032e",
  "0xdf2b0309cfcd8aa7ce28bba18eb4690d65a2616b",
  "0x7da2d3a40d602d451fc7a609e495b8cb0d298ed8",
  "0xcedb0fd903ae5dc6d7ec633a40dd7ea7833759a0",
  "0x457c4d299a13ae5d4cf236d3c4ab328852e4965a",
  "0x0ac4abae0be8d658a818c3123995721e4fb57e58",
  "0xc1d361b9ddb2441cc6ca3cd4490ed781df35903f",
  "0x3555fa0b133ed068b127e8a9efd9a59fc4123be0",
  "0xc732a859d2fce5a48a74a8c1513a50a09692df7d",
  "0xa43f4379a0363432b72bc760ec97bbca966649bf",
  "0x31b265fe036b12a54101d8c72ddbe2cef04e4731",
  "0xc0107f2dd1cdb3939155efc316c7afd63a639115",
  "0x476658cfc09722ed79177f685d1f06176f5e54aa",
  "0x0523a398c512037febf3415468b3239f04826be0",
  "0xfa55fb31d36773d548baef19afd4ed93322a17ff",
  "0x59b3144c71391f19ed79380a898c7cdd17ad62b1",
  "0x14656b67e1726e283038a142b8f860ebd9601d8a",
  "0x05e0f460a790d2330eceaba9664f004d5ea86a47",
  "0x749fa8eccbd55d201c6f9ad2b5d3473793251dbb",
  "0x141f5df37e52627e104ae7748b709629e34b4c37",
  "0xae0ad9e5dcfca306d53ee2d385d0195e8a5d24e3",
  "0xb9f7deee6f91a801a9db46e6c4634f552d0c213d",
  "0x6c48834e7584e2e5526210ce707ec99f9c243cda",
  "0x5a0e8447e5ce335def5f824e4f010b12d5730ea5",
  "0x97e142399c4cba7b4d36b40aa767f9643b34978d",
  "0x5c42854e3f4381bf0a4c5dd515c87ca1a4129fae",
  "0x68a06dd28f4a8c3f7a886fd05c0a3fd13a5be586",
  "0x11a67c3806e8fd537a9792f2d89856eede0f34e6",
  "0x22bd2349e581f09f5a7d5dabcda0be6d64248fb7",
  "0xfa38fcb402c87b7e939291422739e3cb330242e5",
  "0x02e891b189f4a86f80892044c18927a6c36153d6",
  "0x3741d28d4e5d7cab6191a6b0691b11800a0dcf1f",
  "0x8e6c956d8c7a1b4bfa10ef51bae8c19baba6bbe2",
  "0xc03507100c9af14e9184285e63106914e49ad1ff",
  "0xbef491231527c9efb47c45603b85ea66439714a5",
  "0x4ea9cb5baed46c2c3c986e22032defef24ce4fba",
  "0x720f0638f23b82027bea6cccd66eb0af7620f9cd",
  "0x52769b308bb8fc78afdbfa0bd345da8d85eb31fa",
  "0x620c8bec4aa23b9e69a11d78cd69f0877d0861c5",
  "0xc3cdca58c64177dccf4b792b834c9b87e3dd17a1",
  "0x404e70a162487c9af8982a89a5453f389d5257b1",
  "0xce86e9aaaa457ab6af4cf34989377e77cc3af7e0",
  "0xba874d25a1167a5b664eaeae4d090cded4e4fe52",
  "0x9bd680458de070a9b98a7b3e615299da3c5f5905",
  "0x69d1b539f7d8dfeacb2f0e8ff8b8969152fbbe55",
  "0x3d78f5b2b8e239432a9cc5b51d0a3b7c05e02894",
  "0xc91367ae292a605781ce563cfebf9d7214ba6399",
  "0x723702f043771ba3b3a9a3bc8b61503e0a28287e",
  "0xc0f055221ccca75694e6041a1dcd46fa4c2721c7",
  "0x3c7c665a7a54d4deb1e33ef0332a36edbf538caf",
  "0x48fe5c26e4153e8dc6c8f07bfc75ecc605edfdd3",
  "0x334dd823de8037464ef20af6e8cb504821f5f516",
  "0x1be5378b15e91a2c72943b2ddccdaad9a59c4d8b",
  "0xef29bd856d18410a041a8a5d419568497c65536e",
  "0x6de6314e06430c25a5253c68d23e549f1e056f0d",
  "0x0f61ab433c7c336d0153e526a41dd2a6155cea6b",
  "0x75996027dcfb09784be564da5b50b938f22a7c54",
  "0xa0dda1b22bddb40adbc5524138c69ec9f5e7088d",
  "0x4a0d5da6f417b1aa966e478747613891927d0a64",
];

// const addresses = ["0x31C2cb2cd72a0a35Bf1839a2e0d383566bf904b0"];

const splitArray = (arr: string[]) => {
  const chunkSize = 10;

  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }

  return chunks;
};

const convertToCsv = () => {
  let csv = "Address, Collateral Gains\n";

  for (const [address, collateralGains] of Object.entries(
    collateralGainsByDepositor
  )) {
    csv += `${address}, ${collateralGains}\n`;
  }

  fs.writeFileSync("./collateralGains.csv", csv, "utf-8");
};

const main = async () => {
  try {
    const [deployer] = await ethers.getSigners();
    const stabilityPool = await ethers.getContractAt(
      "StabilityPool",
      "0xc2e73270A5Bb1000E8f91371Be09B1a033Ef0e40",
      deployer
    );

    const chunks = splitArray(addresses);

    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async (depositor) => {
          const collateralGains =
            await stabilityPool.getDepositorCollateralGain(depositor);
          sum += collateralGains[0];
          collateralGainsByDepositor[depositor] = ethers.FixedNumber.fromValue(
            collateralGains[0],
            18
          ).toString();
        })
      );
    }

    console.log({
      collateralGainsByDepositor,
      sum: ethers.FixedNumber.fromValue(sum, 18).toString(),
    });

    // convertToCsv();
  } catch (error) {
    console.log(error);
  }
};

main();
