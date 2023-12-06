// import { expect } from "chai";
// import { StoryClient, StoryReadOnlyConfig, Environment, ListLicenseRequest } from "../../src/index";
// import { ReadOnlyClient } from "../../src/types/client";

// describe("License Read Only Functions", () => {
//   let client: ReadOnlyClient;

//   before(async function () {
//     const config: StoryReadOnlyConfig = {
//       environment: Environment.TEST,
//     };

//     client = StoryClient.newReadOnlyClient(config);
//   });

//   describe("Get License", async function () {
//     it("should return a license when the license id is valid", async () => {
//       await expect(
//         client.license.get({
//           licenseId: "5", // Provide a valid license ID
//         }),
//       ).to.not.be.rejected;
//     });

//     it("should handle errors when retrieving a license", async () => {
//       try {
//         await client.license.get({
//           licenseId: "invalid_id", // Provide an invalid license ID
//         });
//         expect.fail("Function should have thrown an error");
//       } catch (error) {}
//     });
//   });

//   describe("List Licenses", async function () {
//     const mockListLicenseRequest: ListLicenseRequest = {
//       ipOrgId: "0xb422E54932c1dae83E78267A4DD2805aa64A8061",
//       ipAssetId: "1",
//     };

//     it("should list all licenses", async () => {
//       await expect(client.license.list(mockListLicenseRequest)).to.not.be.rejected;
//     });

//     it("should handle errors when listing licenses", async () => {
//       try {
//         await client.license.list(mockListLicenseRequest);
//         expect.fail("Function should have thrown an error");
//       } catch (error) {}
//     });
//   });
// });
