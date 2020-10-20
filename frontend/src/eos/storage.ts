const textDecoder = new TextDecoder()

export const resolveIpfsUrl = (src: string) => {
  return getStorageClient().resolveIpfsUri(src);
};

class StorageClient {
  private ipfsGatewayEndpoint =
    true
      ? `https://ipfs.maltablock.org/ipfs/`
      : `https://ipfs.liquidapps.io/ipfs/`;

  constructor() {}

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
