import { JsonRpc } from "eosjs";
import fetch from "node-fetch";
import { NetworkName } from "../types";
import { isProduction } from "../utils";

export const getContractsForNetwork = (networkName) => {
  switch (networkName) {
    case `kylin`:
      return {
        hoster: `maltablock12`,
      };
    case `wax`:
      return {
        hoster: `maltareports`,
      };
    case `eos`:
      return {
        hoster: `maltablock.e`,
      };
    default:
      throw new Error(
        `No contract accounts for "${networkName}" network defined yet`
      );
  }
};

const createNetwork = (nodeEndpoint, chainId) => {
  const matches = /^(https?):\/\/(.+?)(:\d+){0,1}$/.exec(nodeEndpoint);
  if (!matches) {
    throw new Error(
      `Could not parse HTTP endpoint for chain ${chainId}. Needs protocol and port: "${nodeEndpoint}"`
    );
  }

  const [, httpProtocol, host, portMatch] = matches;
  const portString = portMatch
    ? portMatch.replace(/\D/gi, ``)
    : httpProtocol === `https`
    ? `443`
    : `80`;
  const port = Number.parseInt(portString, 10);

  return {
    chainId,
    protocol: httpProtocol,
    host,
    port,
    nodeEndpoint,
  };
};

const KylinNetwork = createNetwork(
  process.env.KYLIN_ENDPOINT || `https://kylin-dsp-2.liquidapps.io:443`,
  `5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191`
);
const WaxTestNetwork = createNetwork(
  process.env.WAXTEST_ENDPOINT || `https://waxtestnet.greymass.com`,
  `f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12`
);
const MainNetwork = createNetwork(
  process.env.EOS_ENDPOINT || `https://dsp.airdropsdac.com:443`,
  `aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906`
);
const WaxNetwork = createNetwork(
  process.env.WAX_ENDPOINT || `https://waxdsp.maltablock.org:443`,
  `1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4`
);

export function getNetworkName() {
  return process.env.EOSIO_NETWORK || `wax`
  // return isProduction() ? `wax` : `kylin`;
}

export function getNetwork(networkName: string) {
  switch (networkName) {
    case `eos`:
      return MainNetwork;
    case `wax`:
      return WaxNetwork;
    case `kylin`:
      return KylinNetwork;
    case `waxtest`:
      return WaxTestNetwork;
    default:
      throw new Error(`Network "${networkName}" not supported yet.`);
  }
}

export const getRpc = (networkName: string): JsonRpc => {
  const rpcs = {};
  if (!rpcs[networkName]) {
    rpcs[networkName] = new JsonRpc(getNetwork(networkName).nodeEndpoint, {
      fetch: fetch,
    });
  }

  return rpcs[networkName];
};
