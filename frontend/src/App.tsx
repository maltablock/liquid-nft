import { Box, Container, Heading, ToastManager, useColorMode } from "bumbag";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Helmet from "react-helmet";
import Footer from "./components/Footer";
import Toolbar from "./components/Toolbar/index";
import ModalsContainer from "./components/Modals/Container";
import UserOverview from "./components/User/Overview";
import { useStore } from "./store/hook";
import PricingOverview from "./components/Pricing";

const App: React.FC<{}> = props => {
  const [rootStore] = useStore(store => [store]);
  const { setColorMode } = useColorMode();
  useEffect(() => {
    rootStore.init();
    setColorMode(`dark`); // just to bust the localstorage of previous visitors
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
      justifyContent="space-between"
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
      <Switch>
        <Route path="/" exact component={UserOverview} />
        <Route path="/pricing" component={PricingOverview} />
        <Route component={UserOverview} />
      </Switch>
      <Footer />

      <ToastManager />
      <ModalsContainer />
    </Box>
  );
};

export default observer(App);
