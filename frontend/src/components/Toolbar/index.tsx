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
      paddingX={{
        default: "major-7",
        "max-tablet": "major-1",
      }}
    >
      <Image src={logoSrc} height={{ default: `36px`, 'max-tablet': `18px`} as any} />
      {isLoggedIn ? (
        <Button
          size="small"
          variant="link"
          type="button"
          palette="secondary"
          fontSize="200"
          fontWeight="700"
          onClick={onClick}
        >
          {walletStore.accountName}
        </Button>
      ) : (
        <Button variant="primary" type="button" onClick={onClick}>
          Log In
        </Button>
      )}
    </Flex>
  );
};

export default withUAL(observer(Toolbar));
