import { Button, Flex, Image } from "bumbag";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { UALProps, withUAL } from "ual-reactjs-renderer";
import { useStore } from "../../store/hook";
import logoSrc from "../../assets/logo-liquid-nft.svg";

const Toolbar: React.FC<UALProps> = props => {
  const [walletStore] = useStore(store => [store.walletStore]);

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
    <Flex
      justifyContent="space-between"
      alignItems="center"
      marginTop="major-7"
      marginX="major-7"
    >
      <Image src={logoSrc} height="36px" />
      <Button
        variant="primary"
        type="button"
        onClick={onClick}
      >
        {isLoggedIn ? walletStore.accountName : `Sign In`}
      </Button>
    </Flex>
  );
};

export default withUAL(observer(Toolbar));
