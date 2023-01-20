import "./node_modules/react/umd/react.development.js";
import "./node_modules/react-dom/umd/react-dom.development.js";
import { getApp } from "./app.js";

ReactDOM.hydrateRoot(
  document,
  React.createElement(
    getApp(React),
    window.cspNonce
      ? {
          nonce: window.cspNonce,
          passNonce: true,
        }
      : {}
    // : { nonce: "" }
  )
);
