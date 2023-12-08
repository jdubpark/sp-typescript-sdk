import { expect } from "chai";
import { StoryClient, StoryConfig, Client } from "../../src";
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

  describe("Configuring license", async function () {
    it("should be able to configure license with default values", async () => {
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
          waitForTransaction: true,
          gasPrice: parseGwei("250"),
        },
      };

      const response = await client.license.configure(configureLicenseRequest);
      console.log("response", response);

      expect(response.txHash).to.be.a("string");
      expect(response.txHash).not.be.undefined;

      expect(response.ipOrgTerms).to.be.a("object");
      expect(response.ipOrgTerms).not.be.undefined;
    });
  });

  describe("License creation", async function () {
    it("should be able to create an NFT with empty/default values", async () => {
      // 1. Create IPO first
      // 2. Configure framework
      // 3. Create license

      const createIpoResponse = await expect(
        client.ipOrg.create({
          name: "Alice In Wonderland",
          symbol: "AIW",
          owner: senderAddress,
          ipAssetTypes: ["Story", "Character"],
          txOptions: {
            waitForTransaction: true,
          },
        }),
      ).to.not.be.rejected;
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
          waitForTransaction: true,
          gasPrice: parseGwei("250"),
        },
      };

      const configureResponse = await client.license.configure(configureLicenseRequest);

      expect(configureResponse.txHash).to.be.a("string");
      expect(configureResponse.txHash).not.be.undefined;

      expect(configureResponse.ipOrgTerms).to.be.a("object");
      expect(configureResponse.ipOrgTerms).not.be.undefined;

      // Create license
      const licenseCreationParams: LicenseCreation = {
        params: [],
        parentLicenseId: "0",
        ipaId: "0",
      };

      const createLicenseRequest: CreateLicenseRequest = {
        ipOrgId: createIpoResponse.ipOrgId,
        // ipOrgId: "0x973748DC37577905a072d3Bf5ea0e8E69547c872",
        params: licenseCreationParams,
        preHookData: [],
        postHookData: [],
        txOptions: {
          waitForTransaction: true,
          gasPrice: parseGwei("250"),
        },
      };

      const response = await expect(client.license.create(createLicenseRequest)).to.not.be.rejected;

      expect(response.txHash).to.be.a("string");
      expect(response.txHash).not.be.undefined;

      expect(response.licenseId).to.be.a("string");
      expect(response.licenseId).not.be.undefined;
    });
  });
});
