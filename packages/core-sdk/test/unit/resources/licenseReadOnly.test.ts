import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { AxiosInstance } from "axios";
import { createMock } from "../testUtils";
import * as sinon from "sinon";
import { PublicClient } from "viem";
import { ListLicenseRequest, LicenseReadOnlyClient } from "../../../src";

chai.use(chaiAsPromised);

describe.only("Test LicenseReadOnlyClient", function () {
  let licenseClient: LicenseReadOnlyClient;
  let axiosMock: AxiosInstance;
  let rpcMock: PublicClient;

  beforeEach(function () {
    axiosMock = createMock<AxiosInstance>();
    rpcMock = createMock<PublicClient>();
    licenseClient = new LicenseReadOnlyClient(axiosMock, rpcMock);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe("Test license.get", function () {
    const licenseMock = {
      id: "24",
      status: 3,
      isReciprocal: true,
      derivativeNeedsApproval: true,
      licensor: "0xf398c12a45bc409b6c652e25bb0a3e702492a4ab",
      revoker: "0xf398c12a45bc409b6c652e25bb0a3e702492a4ab",
      ipOrgId: process.env.TEST_IPORG_ID as string,
      ipAssetId: "1",
      parentLicenseId: "0",
      createdAt: "2023-11-23T02:55:36Z",
      txHash: "0x000645882d175d1facd646f3ecca0bbf31a9b9697d3d3f3a564ce9c885d7eeb2",
    };
    it("should return a license when the license ID is valid", async function () {
      axiosMock.get = sinon.stub().returns({
        data: {
          license: licenseMock,
        },
      });

      const response = await licenseClient.get({
        licenseId: "49",
      });
      console.log(">>>", response);
      expect(response.license).to.deep.equal(licenseMock);
    });

    it("should throw an error", async function () {
      axiosMock.get = sinon.stub().rejects(new Error("HTTP 500"));

      await expect(
        licenseClient.get({
          licenseId: "123",
        }),
      ).to.be.rejectedWith("HTTP 500");
    });

    it("should throw an error when the license ID is invalid", async function () {
      await expect(
        licenseClient.get({
          licenseId: "abc",
        }),
      ).to.be.rejectedWith(`Invalid licenseId. Must be an integer. But got: abc`);
    });
  });

  describe("Test license.list", function () {
    const mockListLicenseRequest: ListLicenseRequest = {
      ipOrgId: process.env.TEST_IPORG_ID as string,
      ipAssetId: "5",
    };
    const licenseMock1 = {
      id: "24",
      status: 3,
      isReciprocal: true,
      derivativeNeedsApproval: true,
      licensor: "0xf398c12a45bc409b6c652e25bb0a3e702492a4ab",
      revoker: "0xf398c12a45bc409b6c652e25bb0a3e702492a4ab",
      ipOrgId: "0x1eBb43775fCC45CF05eaa96182C8762220e17941",
      ipAssetId: "1",
      parentLicenseId: "0",
      createdAt: "2023-11-23T02:55:36Z",
      txHash: "0x000645882d175d1facd646f3ecca0bbf31a9b9697d3d3f3a564ce9c885d7eeb2",
    };
    const licenseMock2 = {
      id: "13",
      status: 3,
      isReciprocal: true,
      derivativeNeedsApproval: true,
      licensor: "0xf398c12a45bc409b6c652e25bb0a3e702492a4ab",
      revoker: "0xf398c12a45bc409b6c652e25bb0a3e702492a4ab",
      ipOrgId: "0x1eBb43775fCC45CF05eaa96182C8762220e17941",
      ipAssetId: "0",
      parentLicenseId: "0",
      createdAt: "2023-11-23T02:12:24Z",
      txHash: "0x08c49125f2f91f8eda0b2a799424a41a825e6051541fd620727a96bdc4bc7a8a",
    };
    const mockResponse = sinon.stub().returns({
      data: {
        licenses: [licenseMock1, licenseMock2],
      },
    });

    it("should return a list of licenses", async function () {
      axiosMock.post = mockResponse;

      const response = await licenseClient.list(mockListLicenseRequest);
      expect(response.licenses).to.be.an("array");
      expect(response.licenses[0]).to.deep.equal(licenseMock1);
      expect(response.licenses[1]).to.deep.equal(licenseMock2);
    });

    it("should return a list of licenses without the request object", async function () {
      axiosMock.post = mockResponse;

      const response = await licenseClient.list();
      expect(response.licenses).to.be.an("array");
      expect(response.licenses[0]).to.deep.equal(licenseMock1);
    });

    it("should throw an error if wrong request object", async function () {
      axiosMock.post = sinon.stub().rejects(new Error("HTTP 500"));
      //@ts-ignore
      await expect(licenseClient.list({ foo: "bar" })).to.be.rejectedWith("HTTP 500");
    });
  });
});
