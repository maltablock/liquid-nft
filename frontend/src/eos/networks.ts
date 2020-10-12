import {
  Api,
  createNetwork,
  createNetworkRandomEndpoint,
} from "@deltalabs/eos-utils";

export const CONTRACTS_MAP = {
  liquidnft: `maltareports`,
};

export const waxMainnet = {
  chainId: `1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4`,
  rpcEndpoints: [
    {
      protocol: `https`,
      // host: `chain.wax.io`,
      host: `api-wax.maltablock.org`,
      port: 443,
    },
  ],
};

export const ualChains = [waxMainnet];

const rpc = createNetwork(`wax`, `https://api-wax.maltablock.org`).rpc;
export const api = new Api({ rpc: rpc, signatureProvider: null as any });

