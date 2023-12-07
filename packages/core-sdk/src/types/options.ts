export type TxOptions = {
  waitForTransaction?: boolean;
  gasPrice?: bigint;
};

export type QueryOptions = {
  pagination?: {
    offset?: number; // starting from 0
    limit?: number;
  };
};
