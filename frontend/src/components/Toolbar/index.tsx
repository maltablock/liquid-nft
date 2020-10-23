import {
  Box,
  Button,
  DropdownMenu,
  Flex,
  Icon,
  Image,
  Link as BBLink,
} from "bumbag";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UALProps, withUAL } from "ual-reactjs-renderer";
import { useStore } from "../../store/hook";
import logoSrc from "../../assets/logo-liquid-nft.svg";

const PAGE_LINKS = [
  {
    name: `Pricing`,
    link: `/`,
  },
];

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
      <Link
        to="/"
        component={props => (
          <BBLink display="inline-flex" alignItems="center" {...props} />
        )}
      >
        <Image
          src={logoSrc}
          height={{ default: `36px`, "max-tablet": `18px` } as any}
        />
      </Link>
      <Flex alignItems="center">
        <Box display={{ default: `block`, "max-tablet": `none` }}>
          <BBLink
            paddingRight="major-5"
            variant="nav"
            href="https://maltablock.org/team"
          >
            About
          </BBLink>
          <Link
            to="/pricing"
            component={props => (
              <BBLink paddingRight="major-5" variant="nav" {...props} />
            )}
          >
            Pricing
          </Link>
        </Box>

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

        <Box display={{ default: `none`, "max-tablet": `block` }}>
          <DropdownMenu
            menu={
              <React.Fragment>
                <DropdownMenu.Item iconBefore="solid-pen">
                  <BBLink
                    paddingRight="major-5"
                    variant="nav"
                    href="https://maltablock.org/team"
                  >
                    About
                  </BBLink>
                </DropdownMenu.Item>
                <DropdownMenu.Item iconBefore="solid-share">
                  <Link
                    to="/pricing"
                    component={props => (
                      <BBLink paddingRight="major-5" variant="nav" {...props} />
                    )}
                  >
                    Pricing
                  </Link>
                </DropdownMenu.Item>
              </React.Fragment>
            }
          >
            <Button variant="ghost" size="small">
              <Icon icon="solid-bars" />
            </Button>
          </DropdownMenu>
        </Box>
      </Flex>
    </Flex>
  );
};

export default withUAL(observer(Toolbar));
