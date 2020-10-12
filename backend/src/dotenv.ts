import * as dotenv from "dotenv";
import { NetworkName } from "./types";

dotenv.config();

export const getEnvConfig = () => {
  const parse = (networkName: NetworkName) => {
    const VAR_NAME = `${networkName.toUpperCase()}_CONFIG`;
    const val = process.env[VAR_NAME];
    if (!val)
      return;

    const [permission, key, cpuPayer, cpuKey] = val.split(`;`).map((x) => x.trim());
    return {
      permission: permission,
      key: key,
    };
  };

  return ([`wax`] as NetworkName[]).reduce(
    (acc, network) => ({
      ...acc,
      [network]: parse(network),
    }),
    {}
  ) as {
    [key: string]: ReturnType<typeof parse>
  };
};
