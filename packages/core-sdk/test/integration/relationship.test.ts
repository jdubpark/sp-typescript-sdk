import { expect } from "chai";
import { StoryClient, StoryConfig, Client, RegisterRelationshipRequest } from "../../src";
import { privateKeyToAccount } from "viem/accounts";
import { Hex, http } from "viem";
import { sepolia } from "viem/chains";

describe("Relationship Functions", function () {
  let client: Client;

  before(function () {
    const config: StoryConfig = {
      chain: sepolia,
      transport: http(process.env.RPC_PROVIDER_URL),
      account: privateKeyToAccount((process.env.WALLET_PRIVATE_KEY || "0x") as Hex),
    };

    client = StoryClient.newClient(config);
  });

  describe("Register", async function () {
    it("should create a relationship and return txHash", async function () {
      const waitForTransaction: boolean = true;
      const mockRegisterRequest: RegisterRelationshipRequest = {
        ipOrgId: "0x1eBb43775fCC45CF05eaa96182C8762220e17941",
        relType: "appears_in",
        srcContract: "0x309C205347E3826472643f9B7EbD8A50D64CCd9e",
        srcTokenId: "1",
        dstContract: "0x309C205347E3826472643f9B7EbD8A50D64CCd9e",
        dstTokenId: "2",
        preHookData: [],
        postHookData: [],
        txOptions: {
          waitForTransaction: waitForTransaction,
        },
      };

      const response = await expect(client.relationship.register(mockRegisterRequest)).to.not.be
        .rejected;

      expect(response.txHash).to.exist.and.be.a("string").and.not.be.empty;
      if (waitForTransaction) {
        expect(response.relationshipId).to.exist.and.be.a("string");
      }
    });
  });
});
