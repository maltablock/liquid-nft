import { observable, action, decorate } from "mobx";
import { useToasts } from 'bumbag';
import RootStore from ".";

export enum MODAL_TYPES {
  SLIPPAGE_PROTECTION
}

export class ModalItem<T = any> {
  modalStore: ModalStore;
  type: MODAL_TYPES;
  @observable data: T;
  resolvePromise: (args: any) => any;

  constructor(
    modalStore: ModalStore,
    type: MODAL_TYPES,
    dialogData: any,
    resolvePromise: (args: any) => any
  ) {
    this.modalStore = modalStore;
    this.type = type;
    this.data = dialogData;
    this.resolvePromise = resolvePromise;
  }

  cancel = () => {
    this.resolvePromise({ canceled: true });
    this.modalStore.modals.remove(this);
  };

  submit = (data: T) => {
    this.resolvePromise({ canceled: false, data });
    this.modalStore.modals.remove(this);
  };
}

type OpenModalResult = {
  canceled: boolean;
  data: any;
};

export default class ModalStore {
  rootStore: RootStore;
  @observable modals = observable.array<ModalItem>([]);
  @observable toasts: ReturnType<typeof useToasts>;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.toasts = {} as any;
  }

  @action setToasts = (toasts: ModalStore["toasts"]) => {
    this.toasts = toasts;
  }

  @action openModal = async (
    type: MODAL_TYPES,
    dialogData?: any
  ): Promise<OpenModalResult> => {
    return new Promise<OpenModalResult>((resolve) => {
      this.modals.push(new ModalItem(this, type, dialogData, resolve));
    }).catch((error) => {
      console.error(`Error in openModal`, error.message);
      return {
        canceled: true,
        data: null,
      };
    });
  };
}
