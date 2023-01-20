export function getApp(React) {
  return function App({ nonce, passNonce }) {
    return React.createElement(
      "html",
      null,
      React.createElement(
        "head",
        null,
        React.createElement("title", null, "Nonce test")
      ),
      React.createElement(
        "body",
        null,
        React.createElement("h1", null, "Nonce test"),
        passNonce
          ? React.createElement("script", {
              id: "nonce-csp",
              nonce,
              dangerouslySetInnerHTML: {
                __html: `window.cspNonce = "${nonce}"`,
              },
            })
          : null,
        React.createElement("script", {
          nonce,
          type: "module",
          src: "/client.js",
        }),
        React.createElement("script", {
          nonce,
          dangerouslySetInnerHTML: { __html: 'console.log("hello world")' },
        })
      )
    );
  };
}
