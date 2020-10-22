import {
  Alert,
  applyTheme,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Link,
  Text,
  styled,
  palette,
} from "bumbag";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { useStore } from "../../store/hook";
import FileUpload from "./FileUpload";
import PendingUploads from "./PendingUploads";
import ExistingUploads from "./ExistingUploads";
import theme from "../../utils/theme";

const Svg = styled(props => {
  console.log(props, palette(`primary`)(theme as any));

  return (
    <svg width="100%" viewBox="0 0 80 80" {...props}>
      <circle id="red" fill={theme.palette.primary} cx="19" cy="19" r="19" />
      <circle fill={theme.palette.secondary} cx="45" cy="40" r="33" />
    </svg>
  );
})`
  & > circle:last-child {
    mix-blend-mode: lighten;
  }

  & > circle#red {
    transform: translateY(41px);
    transition: all 1.5s ease-in-out 1s;
  }

  ${props =>
    props.active
      ? `& > circle#red {
      transform: translateY(0px);
    }`
      : ``}
`;

const UserOverview: React.FC<{}> = props => {
  const [userStore, walletStore] = useStore(store => [
    store.userStore,
    store.walletStore,
  ]);

  const onClick = async () => {
    await walletStore.login();
  };

  return (
    <Container
      use="main"
      breakpoint="widescreen"
      alignX="center"
      marginTop="major-12"
      marginBottom="major-4"
      width="100%"
      paddingX="major-1"
    >
      <Flex
        width="100%"
        flexDirection={{ default: `row`, "max-mobile": `column` }}
        alignItems={{ default: `center`, "max-mobile": `center` }}
      >
        <Box flex="8">
          <Heading
            use="h1"
            fontSize="700"
            color="tertiary"
            letterSpacing="-2px"
            fontWeight="700"
            textTransform="uppercase"
            marginBottom="major-5"
          >
            LiquidNFT is an IPFS pinning service for WAX
          </Heading>
          <Heading
            use="h2"
            fontSize="500"
            color="secondary"
            fontWeight="700"
            marginBottom="major-5"
            maxWidth="31rem"
          >
            Built leveraging LiquidStorage service from DAPP Network.
          </Heading>
          <Text.Block use="p" marginBottom="major-5" maxWidth="31rem">
            LiquidNFT is the easiest way to upload image files of your NFT
            project to <Link href="https://ipfs.io/">IPFS</Link>.
          </Text.Block>
          <Link.Block
            href="https://ipfs.io/"
            marginBottom="major-5"
            fontSize="100"
          >
            IPFS stands for Interplanetary File System
          </Link.Block>
          {userStore.userData ? (
            <FileUpload
              onUpload={userStore.uploadFiles}
              disabled={userStore.isUploading}
            />
          ) : (
            <Button
              width="100%"
              maxWidth="30rem"
              variant="primary"
              type="button"
              onClick={onClick}
            >
              Log In
            </Button>
          )}
        </Box>
        <Box flex="6">
          <Svg active={walletStore.isLoggedIn} />
        </Box>
      </Flex>
      <PendingUploads />
      <ExistingUploads />
    </Container>
  );
};

export default observer(UserOverview);
