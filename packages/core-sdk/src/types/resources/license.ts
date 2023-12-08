import { TypedData } from "../common";
import { QueryOptions, TxOptions } from "../options";

/**
 * Represents the core data model for a License, containing essential information.
 *
 * @public
 */
export type License = {
  id: number;
  isCommercial: boolean;
  status: number;
  licensor: string;
  revoker: string;
  ipOrgId: string;
  licenseeType: number;
  ipAssetId: string;
  parentLicenseId: string;
  termIds: string[];
  termsData: string[];
  createdAt: string;
  txHash: string;
};

export enum ParameterType {
  Bool,
  Number,
  Address,
  String,
  MultipleChoice, // ShortString set
}

export type ParamValues = {
  tag: string;
  value: TypedData;
};

export type ParamDefinition = {
  tag: string;
  paramType: ParameterType;
};

export type Framework = {
  id: string;
  textUrl: string;
  paramDefs: ParamDefinition[];
};

export enum LicensorConfigEnum {
  Unset,
  IpOrgOwnerAlways,
  Source,
}

export type LicensingConfig = {
  frameworkId: string;
  params: ParamValues[];
  licensor: LicensorConfigEnum;
};

/**
 * Represents the response structure for configuring a license using the `license.create` method.
 *
 * @public
 */

export type CreateLicenseRequest = {
  ipOrgId: string;
  parentLicenseId: string;
  ipaId: string;
  params: ParamValues[];
  preHookData?: Array<TypedData>;
  postHookData?: Array<TypedData>;
  txOptions?: TxOptions;
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

/**
 * Represents the response structure for configuring a license using the `license.configure` method.
 *
 * @public
 */
export type ConfigureLicenseRequest = {
  ipOrg: string;
  frameworkId: string;
  params: ParamValues[];
  licensor: LicensorConfigEnum;
  txOptions?: TxOptions;
};

/**
 * Represents the response structure for creating a new license using the `license.configure` method.
 *
 * @public
 */
export type ConfigureLicenseResponse = {
  txHash: string;
  ipOrgTerms?: object;
};

/**
 * Represents the request structure for retrieving license details using the `franchise.get` method.
 *
 * @public
 */
export type GetLicenseRequest = {
  licenseId: string; // Unique identifier of the license to retrieve.
};

/**
 * Represents the response structure for retrieving license details using the `license.get` method.
 *
 * @public
 */
export type GetLicenseResponse = {
  license: License;
};

export type ListLicenseRequest = {
  ipOrgId?: string;
  ipAssetId?: string;
  options?: QueryOptions;
};

/**
 * Represents the request structure for listing multiple licenses using the `license.list` method.
 *
 * @public
 */
export type ListLicenseResponse = {
  licenses: License[];
};
