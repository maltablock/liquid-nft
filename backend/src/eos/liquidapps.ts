import { createClient } from "@liquidapps/dapp-client";
import defaults from "lodash/defaults";
import fetch from 'node-fetch'
import { getNetwork, getNetworkName, getContractsForNetwork } from "./networks";

let client;

// passing the option to createClient does not work
// @ts-ignore
global.fetch = fetch
const getClient = async() => {
  if(!client) {
    const networkName = getNetworkName()
    const network = getNetwork(networkName)
    client = await createClient({ network: networkName, httpEndpoint: network.nodeEndpoint });
  }
  return client
};

type VRAMFetchOptions = {
  contract: string;
  scope: string;
  table: string;
  key: number | string;
  // https://github.com/liquidapps-io/zeus-sdk/blob/master/boxes/groups/services/ipfs-dapp-service/services/ipfs-dapp-service-node/index.js#L236
  key_type?: `number` | `hex` | `symbol`
};

export async function fetchVRAMRow<T>(
  _options: Partial<VRAMFetchOptions>
): Promise<T> {
  const client = await (await getClient()).service('ipfs', getContractsForNetwork().hoster);

  const options: VRAMFetchOptions = defaults(_options, {
    scope: getContractsForNetwork().hoster,
    contract: getContractsForNetwork().hoster,
    table: ``,
    key: 0
  });
  if (!options.key_type && typeof options.key === `number`) {
    options.key_type = `number`;
  }

  try {
    const res = await client.get_vram_row(options.contract, options.scope, options.table, options.key, options);
    return res.row
  } catch (error) {
    throw error;
  }
}
