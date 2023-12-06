import { expect } from "chai";
import { StoryClient, StoryConfig } from "../../src/index";
import { Client } from "../../src/types/client";
import { privateKeyToAccount } from "viem/accounts";
import { Hex, http } from "viem";
import { sepolia } from "viem/chains";
import { RegisterRelationshipTypeRequest } from "../../src/types/resources/relationshipType";

describe("Relationship Type Functions", () => {
  let client: Client;

  const mockRegisterTypeRequest: RegisterRelationshipTypeRequest = {
    ipOrgId: "0xb422E54932c1dae83E78267A4DD2805aa64A8061",
    relType: "appears_in",
    relatedElements: {
      src: 1,
      dst: 1,
    },
    allowedSrcIpAssetTypes: [1],
    allowedDstIpAssetTypes: [1],
    txOptions: {
      waitForTransaction: false,
    },
  };

  before(function () {
    const config: StoryConfig = {
      chain: sepolia,
      transport: http(process.env.RPC_PROVIDER_URL),
      account: privateKeyToAccount((process.env.WALLET_PRIVATE_KEY || "0x") as Hex),
    };

    client = StoryClient.newClient(config);
  });

  describe("RegisterType", async function () {
    it("should create a relationship type and return txHash", async () => {
      await client.relationshipType.register(mockRegisterTypeRequest);
      await expect(client.relationshipType.register(mockRegisterTypeRequest)).to.not.be.rejected;
    });
  });
});
