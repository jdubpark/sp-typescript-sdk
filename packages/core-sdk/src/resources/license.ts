import { Address, PublicClient, WalletClient, getAddress, stringToHex } from "viem";
import { AxiosInstance } from "axios";

import storyProtocolJson from "../abi/json/StoryProtocol.json";
import { storyProtocolConfig } from "../abi/storyProtocol.abi";
import { handleError } from "../utils/errors";
import { waitTxAndFilterLog } from "../utils/utils";
import { LicenseReadOnlyClient } from "./licenseReadOnly";
import {
  ConfigureLicenseRequest,
  ConfigureLicenseResponse,
  CreateLicenseRequest,
  CreateLicenseResponse,
} from "../types/resources/license";
import { licenseRegistryRaw } from "../abi/licenseRegistry.abi";
import { licensingModuleRaw } from "../abi/licensingModule";

/**
 * Client for managing relationships.
 */
export class LicenseClient extends LicenseReadOnlyClient {
  private readonly wallet: WalletClient;

  constructor(httpClient: AxiosInstance, rpcClient: PublicClient, wallet: WalletClient) {
    super(httpClient, rpcClient);
    this.wallet = wallet;
  }

  public async create(request: CreateLicenseRequest): Promise<CreateLicenseResponse> {
    request.params.params.forEach((param) => {
      if (param.tag) {
        param.tag = stringToHex(param.tag as string, { size: 32 });
      }
    });

    const args = [request.ipOrgId, request.params, request.preHookData, request.postHookData];

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
        });
        return { txHash: txHash, licenseId: targetLog?.args.id.toString() };
      } else {
        return { txHash: txHash };
      }
    } catch (error: unknown) {
      handleError(error, "Failed to register license");
    }
  }

  public async configure(request: ConfigureLicenseRequest): Promise<ConfigureLicenseResponse> {
    const { request: call } = await this.rpcClient.simulateContract({
      abi: storyProtocolJson,
      address: getAddress(
        process.env.STORY_PROTOCOL_CONTRACT! || process.env.NEXT_PUBLIC_STORY_PROTOCOL_CONTRACT!,
      ),
      functionName: "configureIpOrgLicensing",
      args: [request.ipOrg as Address, request.config],
      account: this.wallet.account,
    });

    const txHash = await this.wallet.writeContract(call);
    if (request.txOptions?.waitForTransaction) {
      const targetLog = await waitTxAndFilterLog(this.rpcClient, txHash, {
        abi: licensingModuleRaw,
        eventName: "IpOrgLicensingFrameworkSet",
      });
      return { txHash: txHash, ipOrgTerms: targetLog?.args };
    } else {
      return { txHash: txHash };
    }
  }
  catch(error: unknown) {
    handleError(error, "Failed to register license");
  }
}
