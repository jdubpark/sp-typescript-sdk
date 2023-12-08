import { expect } from "chai";
import { StoryClient, StoryReadOnlyConfig, ListLicenseRequest, License } from "../../src/index";
import { ReadOnlyClient } from "../../src/types/client";

describe("License Read Only Functions", () => {
  let client: ReadOnlyClient;

  before(async function () {
    const config: StoryReadOnlyConfig = {};
    client = StoryClient.newReadOnlyClient(config);
  });

  describe("Get License", async function () {
    it("should return a license when the license id is valid", async function () {
      const response = await client.license.get({
        licenseId: process.env.TEST_LICENSE_ID as string,
      });

      expect(response).to.have.property("license");
      expectLicenseFields(response.license);
    });

    it("should handle errors when retrieving a license", async function () {
      return expect(
        client.license.get({
          licenseId: "invalid_id", // Provide an invalid license ID
        }),
      ).to.be.rejected;
    });
  });

  describe("List Licenses", async function () {
    it("should list all licenses", async () => {
      const mockListLicenseRequest: ListLicenseRequest = {
        ipOrgId: process.env.TEST_IPORG_ID as string,
        ipAssetId: "0",
      };
      const response = await client.license.list(mockListLicenseRequest);

      expect(response).to.have.property("licenses");
      expect(response.licenses).to.be.an("array");
      expect(response.licenses.length).to.gt(0);
      expectLicenseFields(response.licenses[0]);
    });

    it("should handle errors when listing licenses", async () => {
      const mockListLicenseRequest: ListLicenseRequest = {
        ipOrgId: "aaaaj",
        ipAssetId: "aa",
      };
      return expect(client.license.list(mockListLicenseRequest)).to.be.rejected;
    });
  });

  function expectLicenseFields(license: License) {
    expect(license).to.have.property("id");
    expect(license).to.have.property("isReciprocal");
    expect(license).to.have.property("derivativeNeedsApproval");
    expect(license).to.have.property("status");
    expect(license).to.have.property("licensor");
    expect(license).to.have.property("revoker");
    expect(license).to.have.property("ipOrgId");
    expect(license).to.have.property("ipAssetId");
    expect(license).to.have.property("parentLicenseId");
    expect(license).to.have.property("createdAt");
    expect(license).to.have.property("txHash");

    expect(license.id).to.be.a("string");
    expect(license.isReciprocal).to.be.a("boolean");
    expect(license.derivativeNeedsApproval).to.be.a("boolean");
    expect(license.status).to.be.a("number");
    expect(license.licensor).to.be.an("string");
    expect(license.revoker).to.be.an("string");
    expect(license.ipOrgId).to.be.an("string");
    expect(license.ipAssetId).to.be.an("string");
    expect(license.parentLicenseId).to.be.an("string");
    expect(license.createdAt).to.be.a("string");
    expect(license.txHash).to.be.a("string");
  }
});
