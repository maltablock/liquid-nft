import { NetworkName } from "../types";
import { RpcError } from "eosjs";
import { logger } from "../logger";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const isProduction = () => process.env.NODE_ENV === `production`;

export const formatBloksTransaction = (network: NetworkName, txId: string) => {
  let bloksNetworkName = network as string;
  if (network === `eos`) bloksNetworkName = ``;
  else if (network === `waxtest`) bloksNetworkName = `wax-test`;

  const prefix = bloksNetworkName ? `${bloksNetworkName}.` : ``;
  return `https://${prefix}bloks.io/transaction/${txId}`;
};

export const extractRpcError = (err: Error | RpcError | any) => {
  let message = err.message;
  if (err instanceof RpcError) {
    try {
      message = JSON.parse(err.message)
        .error.details.map((detail) => {
          return detail.message;
        })
        .join(`\n`);
    } catch {}
  } else if (err.json) {
    // might only be LiquidAPps client lib
    if (err.json.error)
      return err.json.error.details
        .map((detail) => {
          return detail.message;
        })
        .join(`\n`);
  }
  return message;
};
