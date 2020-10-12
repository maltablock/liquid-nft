export type IEOSNetwork = {
  chainId: string;
  nodeEndpoint: string;
  protocol: string;
  host: string;
  port: number;
};

// mimicks EOS C++ smart contract microseconds class
type TMicroseconds = {
  _count: number | string;
};

// mimicks EOS C++ smart contract symbol class
export type TAssetSymbol = {
  code: string;
  precision: number;
};

// mimicks EOS C++ smart contract extended_symbol class
export type TExtendedSymbol = {
  symbol: TAssetSymbol;
  contract: string;
};

export type TAsset = {
  amount: number;
  symbol: TAssetSymbol;
};

export type NetworkName = `eos` | `waxtest` | `kylin` | `wax`;
export function isNetworkName(networkName: string): networkName is NetworkName {
  switch (networkName) {
    case `waxtest`:
    case `kylin`:
    case `eos`:
    case `wax`:
      return true;
  }
  return false;
}

export type TAccountsRow = {
  balance: string;
};

export type TEOSNetwork = {
  chainId: string; // "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
  nodeEndpoint: string; // "https://public.eosinfra.io"
  protocol: string;
  host: string;
  port: number;
};

export function exhaustiveCheck(x: never) {
  throw new Error("exhaustiveCheck: should not reach here");
}

export type ArgsType<T> = T extends (...args: infer U) => any ? U : never;
