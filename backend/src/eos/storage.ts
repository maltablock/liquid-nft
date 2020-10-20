import { createClient } from "@liquidapps/dapp-client";
import fetch from "node-fetch";
import { getEnvConfig } from "../dotenv";
import { extractRpcError } from "../utils";
import { getContractsForNetwork, getNetwork } from "./networks";

// for dfuse in createClient
global.fetch = fetch;

export const getDappClient = async () => {
  const networkName = `eos`;
  const network = getNetwork(networkName);
  return await createClient({
    network: networkName,
    httpEndpoint: network.nodeEndpoint,
    fetch: fetch,
  });
};

class StorageClient {
  private dappStorageClient;

  constructor() {}

  async init() {
    const dappClient = await getDappClient();
    const storageClient = await dappClient.service(
      "storage",
      getContractsForNetwork(`eos`).hoster,
      {}
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
        rawLeaves: false,
      };
      const result = await this.dappStorageClient.upload_public_file(
        data,
        getEnvConfig()[`eos`].key,
        getEnvConfig()[`eos`].permission,
        null,
        options
      );

      const ipfsUri = result.uri;
      const ipfsHash = ipfsUri.replace(/ipfs:\/\//i, ``);
      return ipfsHash;
    } catch (error) {
      let message = extractRpcError(error);
      if (/provisioning failed/i.test(message))
        message = `DSP is out of LiquidStorage quota.`;
      throw new Error(`LiquidStorage error: ${message}`);
    }
  };
}

// gets initialized in RootStore
let storageClient = new StorageClient();

export const getStorageClient = () => {
  return storageClient;
};
