import { expect } from "chai";
import {
  ReadOnlyClient,
  StoryClient,
  StoryReadOnlyConfig,
  RelationshipType,
  ListRelationshipTypesRequest,
} from "../../src";

describe("Relationship Type Read Only Functions", function () {
  let client: ReadOnlyClient;

  before(async function () {
    const config: StoryReadOnlyConfig = {};
    client = StoryClient.newReadOnlyClient(config);
  });

  describe("Get Relationship Type", () => {
    it("should retrieve a relationship type by both ipOrgId and relType", async function () {
      const response = await expect(
        client.relationshipType.get({
          ipOrgId: "0x1ebb43775fcc45cf05eaa96182c8762220e17941",
          relType: "0xc12a5f0d1e5a95f4fc32ff629c53defa11273a372e29ae51ab24323e4af84fc3",
        }),
      ).to.not.be.rejected;

      expect(response).to.have.property("relationshipType");
      expectRelationshipTypeFields(response.relationshipType);
    });

    it("should handle errors when retrieving a relationship type with invalid ipOrgId", async function () {
      return expect(
        client.relationshipType.get({
          ipOrgId: "0xde493e03d2de1cd7820b4f580beced57296b0009",
          relType: "0xc12a5f0d1e5a95f4fc32ff629c53defa11273a372e29ae51ab24323e4af84fc3",
        }),
      ).to.be.rejected;
    });
  });

  describe("List Relationship Types", async function () {
    const mockListRelationshipTypeRequest: ListRelationshipTypesRequest = {
      ipOrgId: "0xb422e54932c1dae83e78267a4dd2805aa64a8061",
      options: {
        pagination: {
          limit: 10,
          offset: 0,
        },
      },
    };

    it("should list all relationship types", async function () {
      const response = await expect(client.relationshipType.list(mockListRelationshipTypeRequest))
        .to.not.be.rejected;

      expect(response).to.have.property("relationshipTypes");
      expect(response.relationshipTypes).to.be.an("array");
      expect(response.relationshipTypes.length).to.be.gt(0);
      expectRelationshipTypeFields(response.relationshipTypes[0]);
    });

    it("should handle errors when listing relationship types with invalid input", async function () {
      return expect(
        client.relationshipType.list({
          ipOrgId: "0xb422e54932c1dae83e78267a4dd2805aa64a806",
        }),
      ).to.be.rejected;
    });
  });

  function expectRelationshipTypeFields(relationshipType: RelationshipType) {
    expect(relationshipType).to.have.property("type");
    expect(relationshipType).to.have.property("ipOrgId");
    expect(relationshipType).to.have.property("srcContract");
    expect(relationshipType).to.have.property("srcRelatable");
    expect(relationshipType).to.have.property("srcSubtypesMask");
    expect(relationshipType).to.have.property("dstContract");
    expect(relationshipType).to.have.property("dstRelatable");
    expect(relationshipType).to.have.property("dstSubtypesMask");
    expect(relationshipType).to.have.property("registeredAt");
    expect(relationshipType).to.have.property("txHash");

    expect(relationshipType.type).to.be.a("string");
    expect(relationshipType.ipOrgId).to.be.a("string");
    expect(relationshipType.srcContract).to.be.a("string");
    expect(relationshipType.srcRelatable).to.be.a("number");
    expect(relationshipType.srcSubtypesMask).to.be.a("number");
    expect(relationshipType.dstContract).to.be.a("string");
    expect(relationshipType.dstRelatable).to.be.a("number");
    expect(relationshipType.dstSubtypesMask).to.be.a("number");
    expect(relationshipType.registeredAt).to.be.a("string");
    expect(relationshipType.txHash).to.be.a("string");
  }
});
