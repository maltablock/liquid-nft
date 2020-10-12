export type TStatRow = {
  supply: string;
  max_supply: string;
  issuer: string;
};

export type TSpotPricesRow = {
  last_modified: string; // "2020-06-29T22:06:32",
  base: string; // "WEOSDT",
  quotes: {
    key: string; // "WAX",
    value: string; // "0.04736360628601946"
  }[];
};

export type TTokensRow = {
  sym: string; // "8,WAX";
  contract: string; // "eosio.token";
  balance: string; // "97318.80765795 WAX";
  depth: string; // "89713.87818181 WAX";
};

export type TAccountsRow = {
  balance: string;
};
