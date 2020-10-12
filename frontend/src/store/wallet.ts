import axios, { AxiosInstance } from "axios";
import {
  formatBlockExplorerTransaction,
  JsonRpc,
  TEosAction,
} from "@deltalabs/eos-utils";
import { Ledger } from "@deltalabs/ual-ledger";
import { Wax } from "@eosdacio/ual-wax";
import { action, observable } from "mobx";
import { Anchor } from "ual-anchor";
import { UAL } from "ual-reactjs-renderer";
import { Scatter } from "ual-scatter";
import { TokenPocket } from "ual-token-pocket";
import { api, waxMainnet, CONTRACTS_MAP } from "../eos/networks";
import RootStore from "./index";
import { BACKEND_BASE_URL } from "../utils/backend";

const formatErrorMessage = (ualError: any) => {
  const originalMsg = (ualError?.cause?.json?.error?.details[0] || ualError)
    .message;

  return {
    title: "Transaction failed",
    text: originalMsg.replace(`assertion failure with message: `, ``),
  };
};

const LS_AUTH_TX_KEY = `liquidnft__authTx`;

const arrayToHex = (data: Uint8Array) => {
  let result = "";
  data.forEach(x => {
    result += ("00" + x.toString(16)).slice(-2);
  });
  return result.toUpperCase();
};

export default class WalletStore {
  rootStore: RootStore;
  rpc: JsonRpc;
  @observable ual?: UAL;
  @observable chainName = `wax`;
  @observable authTx?: {
    serializedTransaction: string;
    signatures: any;
  } = undefined;
  appName = "LiquidNFT";
  authenticators: any[] = [];
  axios = axios.create({
    baseURL: `${BACKEND_BASE_URL}`,
    headers: {
      [`X-Authorization`]: ``,
    },
  });

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    const waxEndpoints = waxMainnet.rpcEndpoints.map(
      endpoint => `${endpoint.protocol}://${endpoint.host}:${endpoint.port}`,
    );

    this.rpc = new JsonRpc(waxEndpoints[0]) as any;
    if (typeof window !== "undefined") {
      try {
        this.setAuthTx(
          JSON.parse(window.localStorage.getItem(LS_AUTH_TX_KEY) || `{}`),
        );
      } catch (error) {
        console.error(error);
      }
    }
    this.initUalAuthenticators();
  }

  private initUalAuthenticators() {
    const waxCloudWallet = new Wax([waxMainnet]);
    const scatter = new Scatter([waxMainnet], { appName: this.appName });
    const anchor = new Anchor([waxMainnet], { appName: this.appName });
    const ledger = new Ledger([waxMainnet]);
    // @ts-ignore
    const tokenPocket = new TokenPocket([waxMainnet], {
      appName: this.appName,
    });
    const authenticators: any[] = [
      waxCloudWallet,
      scatter,
      anchor,
      ledger,
      tokenPocket,
    ];
    this.authenticators = authenticators;
  }

  get isLoggedIn() {
    return Boolean(this.accountInfo);
  }

  get accountInfo() {
    return this.ual?.activeUser;
  }

  get accountName() {
    if (!this.accountInfo) return ``;

    if (typeof this.accountInfo.getName === `function`) {
      return this.accountInfo.getName();
    }
    if (typeof this.accountInfo.wallet !== `undefined`) {
      // token pocket
      return this.accountInfo.wallet.name;
    }
    // scatter, anchor
    return this.accountInfo.accountName;
  }

  get permissionName() {
    const accountInfo = this.accountInfo;
    if (!accountInfo) return;

    let permissionName = "active";
    // e.g. https://github.com/atticlab/eos-wps-front/blob/03cba3c427a54da4efb4baacd57c4e84b6b6c300/src/store/modules/userService/actions.js#L31-L48
    if (typeof accountInfo.scatter !== "undefined") {
      permissionName = accountInfo.scatter.identity.accounts.find(
        (x: any) => x.blockchain === "eos",
      ).authority;
    } else if (accountInfo.requestPermission) {
      // Anchor
      permissionName = accountInfo.requestPermission;
    } else if (typeof accountInfo.wallet !== `undefined`) {
      // Token Pocket
      permissionName = accountInfo.wallet.permissions[0];
    } else {
      console.error("getPermissionName: Unhandled authenticator");
      this.rootStore.modalStore.toasts.danger({
        title: "Login failure",
        message: `Unsupported wallet`,
      });
    }
    return permissionName;
  }

  onUALChange = async (ual: any) => {
    const wasLoggedIn = this.isLoggedIn;
    // ual-reactjs-renderer encapsulates the ual and the only way to get it is through context consumer
    // which is a bad design and requires us to always update the ual if the UALProvider state changes
    this.ual = ual;
    if (this.isLoggedIn && !wasLoggedIn) {
      await this.onLogin();
    }
  };

  onLogin = async () => {
    try {
      console.log(`logged in as ${this.accountName}@${this.permissionName}`);
      // check if we already have an authTx from LS and if it's for the same user
      // could be a fake user with wrong signature, but then the backend will fail
      if (this.authTx && this.authTx.serializedTransaction) {
        const txBuffer = new Uint8Array(
          Buffer.from(this.authTx.serializedTransaction, `hex`),
        );
        const deserializedTx = await api.deserializeTransactionWithActions(
          txBuffer,
        );
        if (
          Array.isArray(deserializedTx.actions) &&
          deserializedTx.actions.length > 0 &&
          deserializedTx.actions[0].data.user === this.accountName
        ) {
          console.log(`cached authTx matches logged in user`, deserializedTx);
        } else {
          this.setAuthTx(undefined);
        }
      }

      if (!this.authTx || !this.authTx.serializedTransaction) {
        this.rootStore.modalStore.toasts.info({
          title: "Authentication required",
          message: `Please sign the login transaction to authenticate.`,
          timeout: 10000,
        });
        await this.authenticate();
      }

      if (this.authTx) {
        await this.rootStore.userStore.fetchUser();
      }
    } catch (error) {
      console.error(error.message);
      this.rootStore.modalStore.toasts.danger({
        title: "Authentication failure",
        message: `Could not authenticate. Please log in and sign the login transaction. ${error.message}`,
      });
    }

    if (!this.authTx || !this.authTx.serializedTransaction) {
      this.logout().catch(error => console.error(error));
    }
  };

  @action login = async () => {
    this.ual?.showModal();
  };

  @action logout = async () => {
    this.ual?.logout();
    this.onLogout();
  };

  onLogout = async () => {
    this.reset();
    this.rootStore.onLogout();
  };

  @action reset = () => {};

  @action init = async () => {};

  @action sendTransaction = async (
    actions: Partial<Omit<TEosAction<any>, "authorization">>[],
  ) => {
    const accountInfo = this.accountInfo;
    if (!accountInfo) {
      this.rootStore.modalStore.toasts.info({
        title: "Login required",
        message: `Please login first`,
      });
      return;
    }

    let transformedActions = actions.map(action => ({
      ...action,
      authorization: [
        {
          actor: this.accountName,
          permission: this.permissionName,
        },
      ],
    }));

    try {
      const options = {
        expireSeconds: 300,
        blocksBehind: 5,
        broadcast: true,
        sign: true,
      };

      console.log("api.transact::action", ...transformedActions);
      const result = await accountInfo.signTransaction(
        { actions: transformedActions },
        options,
      );
      const txUrl = result.transactionId
        ? formatBlockExplorerTransaction(`eosq`)(result.transactionId)
        : ``;
      console.log("api.transact::result", result);
      console.info(`Transaction sent:`, txUrl);
    } catch (error) {
      console.error("api.transact::error", JSON.stringify(error));
    }
  };

  /**
   * Creates a transaction that is signed by the logged in user
   * Backend can check this an use it as proof of auth
   */
  @action async authenticate() {
    const { walletStore } = this.rootStore;
    if (!walletStore.isLoggedIn) {
      this.rootStore.modalStore.toasts.info({
        title: "Login required",
        message: `Please login first`,
      });
      return;
    }

    try {
      const options = {
        expireSeconds: 300,
        blocksBehind: 5,
        sign: true,
        // no need to broadcast it to chain
        broadcast: false,
      };

      let authAction = {
        account: CONTRACTS_MAP.liquidnft,
        name: `login`,
        authorization: [
          {
            actor: this.accountName,
            permission: this.permissionName,
          },
        ],
        data: {
          user: this.accountName,
        },
      };

      const txResult = (
        await walletStore.accountInfo!.signTransaction(
          { actions: [authAction] },
          options,
        )
      ).transaction;
      const tx = {
        serializedTransaction: arrayToHex(txResult.serializedTransaction),
        signatures: txResult.signatures,
      };

      this.setAuthTx(tx);
      return true;
    } catch (error) {
      console.error("api.transact::error", JSON.stringify(error));
      this.rootStore.modalStore.toasts.danger({
        title: "Authentication failure",
        message: `Could not sign the login transaction: ${error.message}`,
      });

      this.setAuthTx(undefined);
      return false;
    }
  }

  private setAuthTx = (authTx: WalletStore["authTx"]) => {
    this.authTx = authTx;
    const authTxString = JSON.stringify(authTx || ``);
    this.axios.defaults.headers[`X-Authorization`] = authTxString;
    window.localStorage.setItem(LS_AUTH_TX_KEY, authTxString);
  };
}
