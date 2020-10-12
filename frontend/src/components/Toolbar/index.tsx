import { Button, Flex } from "bumbag";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { UALProps, withUAL } from "ual-reactjs-renderer";
import { useStore } from "../../store/hook";

const Toolbar: React.FC<UALProps> = (props) => {
  const [walletStore] = useStore((store) => [store.walletStore]);

  useEffect(() => {
    walletStore.onUALChange(props.ual);
  }, [props.ual, walletStore]);

  const isLoggedIn = walletStore.isLoggedIn;
  const onClick = async () => {
    if (isLoggedIn) {
      await walletStore.logout();
    } else {
      await walletStore.login();
    }
  };

  return (
    <Flex justifyContent="flex-end" margin="minor-1">
      <Button
        variant={walletStore.isLoggedIn ? `ghost` : `default`}
        palette="primary"
        type="button"
        onClick={onClick}
      >
        {isLoggedIn ? walletStore.accountName : `Login`}
      </Button>
    </Flex>
  );
};

export default withUAL(observer(Toolbar));
