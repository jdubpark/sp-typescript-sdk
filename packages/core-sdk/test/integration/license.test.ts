import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryConfig, Client } from "../../src";
import * as dotenv from "dotenv";
import { sepolia } from "viem/chains";
import { http, parseGwei, PrivateKeyAccount } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import {
  ConfigureLicenseRequest,
  CreateLicenseRequest,
  LicenseCreation,
  LicensingConfig,
} from "../../src/types/resources/license";

dotenv.config();
chai.use(chaiAsPromised);
chai.config.truncateThreshold = 0;

describe("License Functions", () => {
  let client: Client;
  let senderAddress: string;
  let wallet: PrivateKeyAccount;

  before(function () {
    wallet = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);

    const config: StoryConfig = {
      chain: sepolia,
      transport: http(process.env.RPC_PROVIDER_URL),
      account: wallet,
    };

    senderAddress = config.account.address;
    client = StoryClient.newClient(config);
  });

  describe("License creation", async function () {
    it.only("should be able to create an NFT with empty/default values", async () => {
      const licenseCreationParams: LicenseCreation = {
        params: [],
        parentLicenseId: "0",
        ipaId: "0",
      };

      const createLicenseRequest: CreateLicenseRequest = {
        ipOrgId: "0x35d3f0B8711Df409dd996154eE82c1A4332E5Fc8", // shared wallet
        // ipOrgId: "0x0cEeeFC9AC23755d8786D4d580E1E7cccc25DE12", // ee2a
        params: licenseCreationParams,
        preHookData: [],
        postHookData: [],
        txOptions: {
          waitForTransaction: true,
          gasPrice: parseGwei("250"),
        },
      };

      const response = await expect(client.license.create(createLicenseRequest)).to.not.be.rejected;

      console.log("response", response);
      expect(response.txHash).to.be.a("string");
      expect(response.txHash).not.be.undefined;

      expect(response.licenseId).to.be.a("string");
      expect(response.licenseId).not.be.undefined;
    });
  });

  describe("Configuring license", async function () {
    it.only("should be able to configure license with default values", async () => {
      /*
					Since an IPO's framework can only be configured once,
					we need to create new ones for the test

					1. Create new IPO
					2. Configure license
			*/
      const waitForTransaction: boolean = true;
      const createIpoResponse = await expect(
        client.ipOrg.create({
          name: "Alice In Wonderland",
          symbol: "AIW",
          owner: senderAddress,
          ipAssetTypes: ["Story", "Character"],
          txOptions: {
            waitForTransaction: waitForTransaction,
          },
        }),
      ).to.not.be.rejected;
      console.log("createIpoResponse", createIpoResponse);
      expect(createIpoResponse.txHash).to.be.a("string");
      expect(createIpoResponse.txHash).not.empty;
      expect(createIpoResponse.ipOrgId).to.be.a("string");
      expect(createIpoResponse.ipOrgId).not.empty;

      // Configure license
      const licenseConfig: LicensingConfig = {
        frameworkId: "SPIP-1.0",
        params: [],
        licensor: 1,
      };

      const configureLicenseRequest: ConfigureLicenseRequest = {
        ipOrg: createIpoResponse.ipOrgId,
        config: licenseConfig,
        txOptions: {
          waitForTransaction: false,
          gasPrice: parseGwei("250"),
        },
      };

      // const response = await client.license.configure(configureLicenseRequest);
      // console.log("response", response);

      // expect(response.txHash).to.be.a("string");
      // expect(response.txHash).not.be.undefined;

      // expect(response.ipOrgTerms).to.be.a("object");
      // expect(response.ipOrgTerms).not.be.undefined;
    });
  });
});
