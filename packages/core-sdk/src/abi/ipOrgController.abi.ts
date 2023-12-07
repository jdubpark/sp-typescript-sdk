import { getAddress } from "viem";
import * as dotenv from "dotenv";

if (typeof process !== "undefined") {
  dotenv.config();
}

export const ipOrgControllerAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "address", name: "owner", type: "address" },
      { indexed: false, internalType: "address", name: "ipAssetOrg", type: "address" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      { indexed: false, internalType: "string", name: "symbol", type: "string" },
      { indexed: false, internalType: "string[]", name: "ipAssetTypes", type: "string[]" },
    ],
    name: "IPOrgRegistered",
    type: "event",
  },
] as const;

export const ipOrgControllerConfig = {
  abi: ipOrgControllerAbi,
  address: getAddress(
    process.env.IP_ORG_CONTROLLER_CONTRACT ||
      process.env.NEXT_PUBLIC_IP_ORG_CONTROLLER_CONTRACT ||
      "",
  ),
};
