import { getAddress } from "viem";
import * as dotenv from "dotenv";

if (typeof process !== "undefined") {
  dotenv.config();
}
export const registrationModuleAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "ipAssetId_", type: "uint256" },
      { indexed: true, internalType: "address", name: "ipOrg_", type: "address" },
      { indexed: false, internalType: "uint256", name: "ipOrgAssetId_", type: "uint256" },
      { indexed: true, internalType: "address", name: "owner_", type: "address" },
      { indexed: false, internalType: "string", name: "name_", type: "string" },
      { indexed: true, internalType: "uint8", name: "ipOrgAssetType_", type: "uint8" },
      { indexed: false, internalType: "bytes32", name: "hash_", type: "bytes32" },
      { indexed: false, internalType: "string", name: "mediaUrl_", type: "string" },
    ],
    name: "IPAssetRegistered",
    type: "event",
  },
] as const;

export const registrationModuleConfig = {
  abi: registrationModuleAbi,
  address: getAddress(
    process.env.REGISTRATION_MODULE_CONTRACT ||
      process.env.NEXT_PUBLIC_REGISTRATION_MODULE_CONTRACT ||
      "",
  ),
};
