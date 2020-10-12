import { Provider as BumbagProvider } from "bumbag";
import { observer, Provider } from "mobx-react";
import React from "react";
import ReactDOM from "react-dom";
import { UALProvider as _UALProvider } from "ual-reactjs-renderer";
import App from "./App";
import { waxMainnet } from "./eos/networks";
import RootStore from "./store";
import { useStore } from "./store/hook";
import theme from "./utils/theme";


console.dir(`App version ${process.env.REACT_APP_VERSION}`);

const UALProvider = _UALProvider as any;

const UALWrapper: React.FC<{}> = observer((props) => {
  const walletStore = useStore((store) => store.walletStore);
  const chainName = walletStore.chainName;
  const chains = [waxMainnet];

  return (
    <UALProvider
      key={chainName}
      chains={chains}
      authenticators={walletStore.authenticators}
      appName={walletStore.appName}
    >
      {props.children}
    </UALProvider>
  );
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={RootStore}>
      <BumbagProvider theme={theme as any}>
        <UALWrapper>
          <App />
        </UALWrapper>
      </BumbagProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
