import chai, { expect } from "chai";
import { RelationshipClient } from "../../../src/resources/relationship";
import { createMock } from "../testUtils";
import * as sinon from "sinon";

import chaiAsPromised from "chai-as-promised";
import { AxiosInstance } from "axios";
import { PublicClient, WalletClient, stringToHex } from "viem";
import { SinonStub } from "sinon";
import {
  RelationshipGetRequest,
  RelationshipGetResponse,
  RelationshipListRequest,
  RelationshipListResponse,
} from "../../../src/types/resources/relationship";

chai.use(chaiAsPromised);

describe("Test RelationshipReadOnlyClient", function () {
  let relationshipClient: RelationshipClient;
  let axiosMock: AxiosInstance;
  let rpcMock: PublicClient;
  let walletMock: WalletClient;

  beforeEach(function () {
    axiosMock = createMock<AxiosInstance>();
    rpcMock = createMock<PublicClient>();
    walletMock = createMock<WalletClient>();
    relationshipClient = new RelationshipClient(axiosMock, rpcMock, walletMock);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe("test RelationshipClient.get", () => {
    const mockGetRequest: RelationshipGetRequest = {
      relationshipId: "1",
      options: {
        pagination: {
          offset: 0,
          limit: 10,
        },
      },
    };

    it("should retrieve a relationship by its ID", async () => {
      const mockResponse: { data: RelationshipGetResponse } = {
        data: {
          relationship: {
            id: "rel-1234",
            type: "APPEARS_IN",
            typeId: "type-5678",
            srcContract: "0xSourceContractAddress",
            srcTokenId: "srcToken123",
            srcName: "Source Name",
            dstContract: "0xDestContractAddress",
            dstTokenId: "dstToken456",
            dstName: "Destination Name",
            ttl: 3600, // 1 hour in seconds
            registeredAt: "2023-01-01T00:00:00Z", // ISO 8601 format
            txHash: "0xTransactionHash",
          },
        },
      };

      axiosMock.get = sinon.stub().resolves(mockResponse);

      const response = await relationshipClient.get(mockGetRequest);

      expect(response).to.deep.equal(mockResponse.data);
    });

    it("should handle errors when retrieving a relationship", async () => {
      axiosMock.get = sinon.stub().rejects(new Error("HTTP 500"));
      await expect(relationshipClient.get(mockGetRequest)).to.be.rejectedWith("HTTP 500");
    });

    it("should throw error if asset id is invalid", async function () {
      try {
        await relationshipClient.get({
          relationshipId: "fake relationship id",
        });
        expect.fail(`Function should not get here, it should throw an error `);
      } catch (error) {
        // function is expected to throw.
      }
    });
  });

  describe("test RelationshipClient.list", () => {
    const mockListRequest: RelationshipListRequest = {
      tokenId: "token123",
      options: {
        pagination: {
          offset: 0,
          limit: 10,
        },
      },
    };

    it("should list all relationships", async () => {
      const mockResponse: { data: RelationshipListResponse } = {
        data: {
          relationships: [
            {
              id: "rel-1234",
              type: "APPEARS_IN",
              typeId: "type-5678",
              srcContract: "0xSourceContractAddress",
              srcTokenId: "srcToken123",
              srcName: "Source Name",
              dstContract: "0xDestContractAddress",
              dstTokenId: "dstToken456",
              dstName: "Destination Name",
              ttl: 3600,
              registeredAt: "2023-01-01T00:00:00Z",
              txHash: "0xTransactionHash",
            },
            // ... Add more dummy relationships as needed
          ],
        },
      };

      axiosMock.post = sinon.stub().resolves(mockResponse);

      const response = await relationshipClient.list(mockListRequest);

      expect(response).to.deep.equal(mockResponse.data);
    });

    it("should handle errors when listing relationships", async () => {
      axiosMock.post = sinon.stub().rejects(new Error("HTTP 500"));
      await expect(relationshipClient.list(mockListRequest)).to.be.rejectedWith("HTTP 500");
    });
  });
});
