import { useToasts } from "bumbag";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { useStore } from "../../store/hook";

const ModalsContainer: React.FC<{}> = () => {
  const modalStore = useStore(store => store.modalStore);
  const toasts = useToasts();
  useEffect(() => {
    modalStore.setToasts(toasts);
  }, []);

  return (
    <div>
    </div>
  );
};

export default observer(ModalsContainer);
