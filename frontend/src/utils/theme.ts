import { css } from "bumbag";
import {
  faSearch,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

const theme = {
  global: {
    fontSize: 18,
    styles: {
      base: css`
        body {
          overflow-x: hidden;
          padding: 0;
          margin: 0;
          font-size: 16px;
          font-weight: 500;
          color: black;
          background-repeat: no-repeat;
          background-color: #ffffff;

          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        button,
        input[type="submit"],
        input[type="reset"] {
          background: none;
          border: none;
          color: inherit;
          padding: 0;
          font: inherit;
          cursor: pointer;
        }

        a {
          cursor: pointer;
          color: inherit;
          text-decoration: none;
        }

        p {
          margin: 0;
        }

        body,
        * {
          font-family: "Montserrat", sans-serif;
          box-sizing: border-box;
        }
      `,
    },
  },
  fonts: {
    importUrls: [
      `https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700&display=swap`,
    ],
    default: "Montserrat",
    heading: "Montserrat",
  },
  palette: {
    primary: "#404dff",
    transparent: "#00000000",
  },
  Icon: {
    iconSets: [
      {
        icons: [faSearch, faTimes, faInfoCircle],
        prefix: "solid-",
        type: "font-awesome",
      },
      {
        icons: [],
        prefix: "regular-",
        type: "font-awesome",
      },
    ],
  },
  Tooltip: {
    Content: {
      styles: {
        base: {
          zIndex: `88888888`,
        },
      },
      defaultProps: {
        hasArrow: true,
      },
    },
  },
};

export default theme;
