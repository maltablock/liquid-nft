import { css } from "bumbag";
import {
  faSearch,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import bgSrc from "../assets/bg.jpg";

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
          background-repeat: no-repeat;
          background-color: #000000;

          background: url(${bgSrc}) no-repeat center center fixed;
          background-size: cover;

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
          font-family: "Roboto", sans-serif;
          box-sizing: border-box;
        }
      `,
    },
  },
  fonts: {
    importUrls: [
      `https://fonts.googleapis.com/css?family=Roboto:100,200,300,400,500,600,700&display=swap`,
      `https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700&display=swap`,
    ],
    default: "Roboto",
    heading: "Roboto",
  },
  palette: {
    primary: "#ff4f3e",
    secondary: "#01ef7a",
    tertiary: "#a4ff00",
    transparent: "#00000000",
    background: "#003547",
    background2: "#003547",
    gray500: `#A1A8B3`,
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
        timeout: 10000,
      },
    },
  },
  Button: {
    variants: {
      primary: {
        styles: {
          base: {
            color: `white`,
            backgroundColor: `primary`,
            borderRadius: `20px`,
            padding: `10px 40px`,
            fontSize: `200`,
            lineHeight: `20px`,
            minHeight: `unset`,
          },
        },
      },
    },
  },
  Link: {
    Block: {
      styles: {
        base: {
          color: `secondary`,
          fontWeight: `500`,
          textDecoration: `underline`,
        },
      },
    },
    styles: {
      base: {
        color: `secondary`,
        fontWeight: `500`,
      },
    },
    variants: {
      primary: {
        styles: {
          base: {
            color: `white`,
            backgroundColor: `primary`,
            borderRadius: `20px`,
            padding: `10px 40px`,
            fontSize: `200`,
            lineHeight: `20px`,
            minHeight: `unset`,
          },
        },
      },
    },
  },
};

export default theme;
