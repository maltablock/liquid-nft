import React from "react";
import WalletStore from "./wallet";
import UserStore from "./user";
import ModalStore from "./modal";

export default class RootStore {
  walletStore = new WalletStore(this);
  userStore = new UserStore(this);
  modalStore = new ModalStore(this);

  async init() {
    try {
      await Promise.all([
        this.walletStore.init(),
        this.userStore.init(),
      ]);

      // setInterval(() => {
      //   Promise.all([
      //     this.walletStore.refetch(),
      //   ]).catch(() => null)
      // }, 1e4);
    } catch (error) {
      throw new Error(`Error while initializing store: ${error.message}`);
    }
  }

  get rpc() {
    return this.walletStore.rpc;
  }

  onLogout = async () => {
    await Promise.all([
      this.userStore.onLogout(),
    ]);
  }
}

export const rootStore = new RootStore();

// expose for testing
if (typeof window !== `undefined`) {
  // @ts-ignore
  window.store = rootStore;
}

export const storeContext = React.createContext<RootStore>(rootStore);
