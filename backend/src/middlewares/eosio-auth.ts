import ecc from "eosjs-ecc";
import { digestFromSerializedData } from "eosjs/dist/eosjs-jssig";
import * as express from "express";
import * as HttpStatus from "http-status-codes";
import { getApi } from "../eos/api";
import { TEosAction } from "@deltalabs/eos-utils";
import { logger } from "../logger";
import {
  getRpc,
  getContractsForNetwork,
  getNetwork,
  getNetworkName,
} from "../eos/networks";

type AuthTx = {
  serializedTransaction: string; // hex
  signatures: string[]; // array of SIG_ signature strings
};

const EXPECTED_ACTION_NAME = `login`;

export const checkAuth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    // lowercase for some reason
    const authTx: string = req.headers[`x-authorization`];
    if (!authTx) throw new Error(`Not authenticated`);
    const { serializedTransaction, signatures } = JSON.parse(authTx) as AuthTx;
    if (!serializedTransaction || !signatures)
      throw new Error(`'authTx' missing fields`);

    const tx: {
      actions: TEosAction[];
      expiration;
    } = getApi().deserializeTransaction(
      Buffer.from(serializedTransaction, `hex`)
    );

    const expiration = new Date(`${tx.expiration}Z`);
    if (Date.now() - expiration.getTime() > 7 * 24 * 60 * 60 * 1000) {
      throw new Error(`Authentication expired at ${expiration.toISOString()}`);
    }

    const authAction = tx.actions.find(
      (action) =>
        action.account === getContractsForNetwork().hoster &&
        action.name === EXPECTED_ACTION_NAME
    );
    if (!authAction)
      throw new Error(
        `Transaction is missing the '${EXPECTED_ACTION_NAME}' action`
      );
    const declaredAuth = authAction.authorization[0];
    const accountInfo = await getRpc().get_account(declaredAuth.actor);
    const accountPermission = accountInfo.permissions.find(
      (p) => p.perm_name === declaredAuth.permission
    );
    if (!accountPermission)
      throw new Error(`Permission does not exist on account anymore`);

    const sigBuffer = Buffer.from(
      // returns a number[]
      digestFromSerializedData(
        getNetwork(getNetworkName()).chainId,
        new Uint8Array(Buffer.from(serializedTransaction, `hex`))
      )
    );
    const recoveredKey = ecc.recoverHash(signatures[0], sigBuffer);

    const accountPermissionKeys = accountPermission.required_auth.keys.map(
      (key) => key.key
    );

    if (!accountPermissionKeys.includes(recoveredKey))
      throw new Error(
        `Invalid signature, got publicKey: ${recoveredKey}. Should be one of ${accountPermissionKeys.join(
          `, `
        )}`
      );

    // @ts-ignore
    req.account = declaredAuth.actor;
    return next();
  } catch (err) {
    logger.error(`checkAuth error`, err.stack);
    res.status(HttpStatus.UNAUTHORIZED);
    next(err);
  }
};
