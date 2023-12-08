import { QueryOptions, TxOptions } from "../options";

/**
 * Core data model for License.
 *
 * @public
 */
export type License = {
  id: string;
  isReciprocal: boolean;
  derivativeNeedsApproval: boolean;
  status: number;
  licensor: string;
  revoker: string;
  ipOrgId: string;
  ipAssetId: string;
  parentLicenseId: string;
  createdAt: string;
  txHash: string;
};

interface CreateLicenseRequest {
  ipOrgId: string;
  parentLicenseId?: string;
  isCommercial: boolean;
  preHooksCalldata?: Record<string, undefined>[];
  postHooksCalldata?: Record<string, undefined>[];
  txOptions?: TxOptions;
}

/**
 * Represents the request structure for creating a new license NFT (createLicenseNft on StoryProtocol.sol)
 *
 * @public
 */
export interface CreateLicenseNftRequest extends CreateLicenseRequest {
  licensee: string;
}

/**
 * Represents the request structure for creating a new IPA-bound license (createIpaBoundLicense on StoryProtocol.sol)
 *
 * @public
 */
export interface CreateIpaBoundLicenseRequest extends CreateLicenseRequest {
  ipaId: number;
}

/**
 * Request type for license.get method.
 *
 * @public
 */
export type GetLicenseRequest = {
  licenseId: string;
};

/**
 * Response type for license.get method.
 *
 * @public
 */
export type GetLicenseResponse = {
  license: License;
};

/**
 * Request type for license.list method.
 *
 * @public
 */
export type ListLicenseRequest = {
  ipOrgId?: string;
  ipAssetId?: string;
  options?: QueryOptions;
};

/**
 * Response type for license.list method.
 *
 * @public
 */
export type ListLicenseResponse = {
  licenses: License[];
};

/**
 * Represents the response structure for creating a new license using the `license.create` method.
 *
 * @public
 */
export type CreateLicenseResponse = {
  txHash: string; // Transaction hash of the license creation transaction.
  licenseId?: string;
};
