import { Box, Container, Heading, ToastManager } from "bumbag";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import Helmet from "react-helmet";
import Footer from "./components/Footer";
import Toolbar from "./components/Toolbar/index";
import ModalsContainer from "./components/Modals/Container";
import UserOverview from "./components/User/Overview";
import { useStore } from "./store/hook";

const App: React.FC<{}> = props => {
  const [rootStore] = useStore(store => [store]);

  useEffect(() => {
    rootStore.init();
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      backgroundPosition="center center"
      backgroundAttachment="fixed"
    >
      <Helmet>
        <title>Liquid NFT</title>
        <meta name="title" content="Liquid NFT" />
        <meta name="description" content="Pin files to IPFS" />
        <meta name="robots" content="index, follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="author" content="Malta Block" />
      </Helmet>
      <Box use="header" width="100%" zIndex={1}>
        <Toolbar />
      </Box>
      <Container
        use="main"
        breakpoint="desktop"
        alignX="center"
        marginBottom="major-4"
      >
        <Heading marginBottom="major-12" color="primary">Liquid NFT</Heading>
        <UserOverview />
      </Container>
      <Footer />

      <ToastManager />
      <ModalsContainer />
    </Box>
  );
};

export default observer(App);
