import { Address, PublicClient, WalletClient, getAddress, stringToHex } from "viem";
import { AxiosInstance } from "axios";

import storyProtocolJson from "../abi/json/StoryProtocol.json";
import { storyProtocolConfig } from "../abi/storyProtocol.abi";
import { handleError } from "../utils/errors";
import { typedDataToBytes, waitTxAndFilterLog } from "../utils/utils";
import { LicenseReadOnlyClient } from "./licenseReadOnly";
import {
  ConfigureLicenseRequest,
  ConfigureLicenseResponse,
  CreateLicenseRequest,
  CreateLicenseResponse,
} from "../types/resources/license";
import { licenseRegistryRaw } from "../abi/licenseRegistry.abi";
import { licensingModuleRaw } from "../abi/licensingModule";
import { TypedData } from "../types/common";

/**
 * Client for managing relationships.
 */
export class LicenseClient extends LicenseReadOnlyClient {
  private readonly wallet: WalletClient;
  public hash: string;
  constructor(httpClient: AxiosInstance, rpcClient: PublicClient, wallet: WalletClient) {
    super(httpClient, rpcClient);
    this.wallet = wallet;
    this.hash = "foo";
  }

  public async create(request: CreateLicenseRequest): Promise<CreateLicenseResponse> {
    const parsedParams = this.parseParamValues(request.params);

    const createLicenseParams = {
      params: parsedParams,
      parentLicenseId: request.parentLicenseId,
      ipaId: request.ipaId,
    };

    const args = [request.ipOrgId, createLicenseParams, request.preHookData, request.postHookData];

    try {
      const { request: call } = await this.rpcClient.simulateContract({
        ...storyProtocolConfig,
        functionName: "createLicense",
        args,
        account: this.wallet.account,
      });
      const txHash = await this.wallet.writeContract(call);
      if (request.txOptions?.waitForTransaction) {
        const targetLog = await waitTxAndFilterLog(this.rpcClient, txHash, {
          abi: licenseRegistryRaw,
          eventName: "LicenseRegistered",
          confirmations: request.txOptions?.numBlockConfirmations,
        });
        return { txHash: txHash, licenseId: targetLog?.args.id.toString() };
      } else {
        return { txHash: txHash };
      }
    } catch (error: unknown) {
      handleError(error, `Failed to register license`);
    }
  }

  public async configure(request: ConfigureLicenseRequest): Promise<ConfigureLicenseResponse> {
    const parsedParams = this.parseParamValues(request.params);
    const config = {
      frameworkId: request.frameworkId,
      params: parsedParams,
      licensor: request.licensor,
    };

    try {
      const { request: call } = await this.rpcClient.simulateContract({
        // ...storyProtocolConfig,
        abi: storyProtocolJson,
        address: getAddress(
          process.env.STORY_PROTOCOL_CONTRACT! || process.env.NEXT_PUBLIC_STORY_PROTOCOL_CONTRACT!,
        ),
        functionName: "configureIpOrgLicensing",
        args: [request.ipOrg as Address, config],
        account: this.wallet.account,
      });
      const txHash = await this.wallet.writeContract(call);
      this.hash = txHash;
      if (request.txOptions?.waitForTransaction) {
        const targetLog = await waitTxAndFilterLog(this.rpcClient, txHash, {
          abi: licensingModuleRaw,
          eventName: "IpOrgLicensingFrameworkSet",
          confirmations: request.txOptions?.numBlockConfirmations,
        });
        // return { txHash: txHash };
        return { txHash: txHash, ipOrgTerms: targetLog?.args };
      } else {
        return { txHash: txHash };
      }
    } catch (error: unknown) {
      handleError(error, "Failed to configure license");
    }
  }

  private parseParamValues(params: { tag: string; value: TypedData }[]) {
    return params.map((param: { tag: string; value: TypedData }) => {
      if (param.tag.toLowerCase() === "attribution") {
        return {
          ...param,
          tag: "0x4174747269627574696f6e00000000000000000000000000000000000000000b",
          value: typedDataToBytes(param.value),
        };
      } else if (param.tag.toLowerCase() === "derivatives-allowed") {
        return {
          ...param,
          tag: "0x44657269766174697665732d416c6c6f77656400000000000000000000000013",
          value: typedDataToBytes(param.value),
        };
      }
      return {
        ...param,
        tag: stringToHex(param.tag, { size: 32 }),
        value: typedDataToBytes(param.value),
      };
    });
  }
}
