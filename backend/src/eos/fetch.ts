import { Action } from "eosjs/dist/eosjs-serialize";
import { NetworkName } from "../types";
import { getApi } from "./api";
import {
  getContractsForNetwork,
  getRpc,
  getNetwork,
  getNetworkName,
} from "./networks";
import { logger } from "../logger";
import { TTransactionResult } from "./types";
import { getEnvConfig } from "../dotenv";

// https://github.com/EOSIO/eosjs-api/blob/master/docs/api.md#eos.getTableRows
type GetTableRowsOptions = {
  json?: boolean;
  code?: string;
  scope?: string;
  table?: string;
  lower_bound?: number | string;
  upper_bound?: number | string;
  limit?: number;
  key_type?: string;
  index_position?: string;
};

const MAX_PAGINATION_FETCHES = 20;

export const fetchRows = async <T>(
  options: GetTableRowsOptions
): Promise<T[]> => {
  const rpc = getRpc();
  const mergedOptions = {
    json: true,
    lower_bound: undefined,
    upper_bound: undefined,
    limit: 9999,
    ...options,
  };

  let lowerBound = mergedOptions.lower_bound;

  const result = await rpc.get_table_rows({
    ...mergedOptions,
    lower_bound: lowerBound,
  });

  return result.rows;
};

// work around the limit bug in nodeos due to max timeout
// https://github.com/EOSIO/eos/issues/3965
export const fetchAllRows = async <T>(
  options: GetTableRowsOptions,
  indexName = `id`
): Promise<T[]> => {
  const rpc = getRpc();
  const mergedOptions = {
    json: true,
    lower_bound: 0,
    upper_bound: undefined,
    limit: 9999,
    ...options,
  };

  let rows: T[] = [];
  let lowerBound = mergedOptions.lower_bound;

  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < MAX_PAGINATION_FETCHES; i += 1) {
    const result = await rpc.get_table_rows({
      ...mergedOptions,
      lower_bound: lowerBound,
    });
    rows = rows.concat(result.rows);

    if (!result.more || result.rows.length === 0) break;

    // EOS 2.0 api
    if (typeof result.next_key !== `undefined`) {
      lowerBound = result.next_key;
    } else {
      lowerBound =
        Number.parseInt(
          `${result.rows[result.rows.length - 1][indexName]}`,
          10
        ) + 1;
    }
  }

  return rows;
};

type ScopeResult = {
  code: string;
  count: number;
  payer: string;
  scope: string;
  table: string;
};

export const fetchAllScopes = async (
  contract: string,
  table: string
): Promise<string[]> => {
  const rpc = getRpc();
  const mergedOptions = {
    json: true,
    lower_bound: undefined,
    upper_bound: undefined,
    limit: 9999,
    code: contract,
    table,
  };
  const rows = (await rpc.get_table_by_scope(mergedOptions))
    .rows as ScopeResult[];
  return rows.map((row) => row.scope);
};

export const fetchHeadBlockNumbers = async () => {
  const rpc = getRpc();
  const response = await rpc.get_info();
  return {
    headBlockTime: response.head_block_time,
    headBlockNumber: response.head_block_num,
    lastIrreversibleBlockNumber: response.last_irreversible_block_num,
  };
};

const buffer2hex = (buffer: Buffer): string =>
  Array.from(buffer, (x) => ("00" + x.toString(16)).slice(-2)).join("");

export const cosign = async (tx, expireSeconds = 30) => {
  const api = getApi();
  // https://github.com/EOSIO/eosjs/blob/master/src/eosjs-api.ts#L214-L254
  let pushTransactionArgs = await api.transact(tx, {
    // don't sign yet, as we don't have all keys and signing would fail
    sign: false,
    // don't broadcast yet, merge signatures first
    broadcast: false,
    blocksBehind: 3,
    expireSeconds,
  });

  // JSSignatureProvider throws errors when encountering a key that it doesn't have a private key for
  // so we cannot use it for partial signing unless we change requiredKeys
  // https://github.com/EOSIO/eosjs/blob/849c03992e6ce3cb4b6a11bf18ab17b62136e5c9/src/eosjs-jssig.ts#L38
  const availableKeys = await api.signatureProvider.getAvailableKeys();

  const serializedTx = pushTransactionArgs.serializedTransaction;
  const signArgs = {
    chainId: getNetwork(getNetworkName()).chainId,
    requiredKeys: availableKeys,
    serializedTransaction: serializedTx,
    abis: [],
  };
  pushTransactionArgs = await api.signatureProvider.sign(signArgs);

  const returnValue = {
    ...pushTransactionArgs,
    serializedTransaction: buffer2hex(
      pushTransactionArgs.serializedTransaction
    ),
  };

  return returnValue;
};
