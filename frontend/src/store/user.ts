import { action, computed, observable } from "mobx";
import { sendBackendRequest, sendBackendUploadRequest } from "../utils/backend";
import RootStore from "./index";
import { TUploadArg } from "../components/User/FileUpload";

type TUserData = {
  account: string;
  bytesPinned: number;
  files: {
    ipfsHash: string;
    name: string;
    size: number;
    uploadedAt: string; // ISO Date string
  }[];
};

export default class UserStore {
  rootStore: RootStore;
  @observable userData?: TUserData = undefined;
  @observable pendingUploads: TUploadArg[] = [];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  init = async () => {};

  @action async fetchUser() {
    try {
      const { user } = await sendBackendRequest<any, { user: TUserData }>(
        this.rootStore.walletStore.axios,
        `user`,
        {},
      );
      this.userData = user;
      this.onUserFetch();
    } catch (error) {
      console.error(error.message);
      this.rootStore.modalStore.toasts.danger({
        title: "Error",
        message: `Could not load user: ${error.message}`,
        timeout: 0,
      });
    }
  }

  @action uploadFiles = async (files: TUploadArg[]) => {
    try {
      this.pendingUploads = files;
      const formData = new FormData();
      files.forEach(file => {
        formData.append("file", file.fileBlob);
      });
      const { user } = await sendBackendUploadRequest<{ user: TUserData }>(
        this.rootStore.walletStore.axios,
        formData,
      );
      this.userData = user;

      this.rootStore.modalStore.toasts.success({
        title: "Success",
        message: `File uploaded to IPFS`,
      });
    } catch (error) {
      console.error(error.message);
      this.rootStore.modalStore.toasts.danger({
        title: "Upload failure",
        message: `Could not upload files: ${error.message}`,
        timeout: 10000,
      });
    } finally {
      this.pendingUploads = [];
    }
  };

  @action reset = () => {
    this.userData = undefined;
  };

  onUserFetch() {}

  onLogout = async () => {
    this.reset();
  };

  @computed get isUploading() {
    return this.pendingUploads.length > 0;
  }
}
