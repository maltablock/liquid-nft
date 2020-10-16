import { createClient } from "@liquidapps/dapp-client";
import { RpcError } from "eosjs";
import { getEnvConfig } from "../dotenv";
import { logger } from "../logger";
import { extractRpcError } from "../utils";
import { getNetwork, getNetworkName, getContractsForNetwork } from "./networks";
import fetch from "node-fetch";

// for dfuse in createClient
global.fetch = fetch;
const textDecoder = new TextDecoder();

export const getDappClient = async () => {
  const networkName = getNetworkName();
  const network = getNetwork(networkName);
  return await createClient({
    network: networkName,
    httpEndpoint: network.nodeEndpoint,
    fetch: fetch,
  });
};

export const resolveIpfsUrl = (src: string) => {
  if (src.startsWith(`ipfs://`)) return getStorageClient().resolveIpfsUri(src);
  return src;
};

class StorageClient {
  private dappStorageClient;
  private ipfsGatewayEndpoint =
    getNetworkName() === `wax`
      ? `https://ipfs.maltablock.org/ipfs/`
      : `https://ipfs.liquidapps.io/ipfs/`;

  constructor() {}

  async init() {
    const dappClient = await getDappClient();
    const storageClient = await dappClient.service(
      "storage",
      getContractsForNetwork().hoster
    );

    this.dappStorageClient = storageClient;
    // fix a bug with current @liquid-apps/client
    // const innerAuthClient = this.dappStorageClient.auth;
    // innerAuthClient.authContract = `authentikeos`;
  }

  upload = async (data: Buffer) => {
    try {
      // https://github.com/liquidapps-io/zeus-sdk/blob/master/boxes/groups/services/storage-dapp-service/test/storage.spec.js#L115
      const options = {
        rawLeaves: true
      };
      const result = await this.dappStorageClient.upload_public_file(
        data,
        getEnvConfig()[getNetworkName()].key,
        getEnvConfig()[getNetworkName()].permission,
        null,
        options,
      );

      const ipfsUri = result.uri;
      return ipfsUri;
    } catch (error) {
      let message = extractRpcError(error);
      if (/provisioning failed/i.test(message))
        message = `DSP is out of LiquidStorage quota.`;
      throw new Error(`LiquidStorage error: ${message}`);
    }
  };

  getFileAsBuffer = async (ipfsUri: string): Promise<Buffer> => {
    const ipfsGatewayUri = this.resolveIpfsUri(ipfsUri);
    const response = await fetch(ipfsGatewayUri, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        // "Content-Type": "application/json",
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
    });

    if (!response.ok) {
      throw new Error(
        `Could not fetch file "${this.getIpfsHash(ipfsUri).slice(
          0,
          16
        )}..." from IPFS. ${response.statusText}`
      );
    }

    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  };

  getFileAsString = async (ipfsUri: string) => {
    const buffer = await this.getFileAsBuffer(ipfsUri);
    return textDecoder.decode(buffer);
  };

  getIpfsHash(ipfsUriOrHash: string) {
    return ipfsUriOrHash.replace(/^ipfs:\/\//, "");
  }

  resolveIpfsUri(ipfsUriOrHash: string) {
    const ipfsHash = this.getIpfsHash(ipfsUriOrHash);
    return `${this.ipfsGatewayEndpoint}${ipfsHash}`;
  }
}

// gets initialized in RootStore
let storageClient = new StorageClient();

export const getStorageClient = () => {
  return storageClient;
};
