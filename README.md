# Nonce Hydration Issues

This is an example of nonce hydration issues. It's as simple as possible (no
build tools) to demonstrate the issue.

## How to run

```bash
npm install
npm run dev
```

Open http://localhost:3333 in your browser and check out the console. You'll see
the following error:

```
react-dom.development.js:73 Warning: Extra attributes from the server: nonce
    at script
    at body
    at html
    at App (http://localhost:3333/app.js:2:25)
```

This is resolved by passing `""` as the `nonce` prop to `script` tags on the
client (but not the server). This works because the browser will clear the
`nonce` value automatically before any JavaScript can run (provided the nonce
value matches the CSP nonce value). So when the client hydrates, the `nonce` is
empty and passing `""` for the nonce value on the client matches what the
browser did to it.

You can test this out by opening `client.js` and adding `nonce: ""` to the props
passed to the App component. When you do this, you'll notice the warning
disappears.

However, most people don't solve the problem this way. Instead they either use
`suppressHydrationWarning` (not great because it could hide actual issues for
inline scripts especially) or they pass the `nonce` value from the server to the
client. This is a really bad idea as illustrated next:

Go to http://localhost:3333/?passNonce, then you'll see the following error:

```
react-dom.development.js:73 Warning: Prop `nonce` did not match. Server: "" Client: "rj3157e91u"
    at script
    at body
    at html
    at App (http://localhost:3333/app.js:2:25)
```

This is what happens when the server render includes the data that needs to be
hydrated. Because that data often includes the `nonce` attribute, the
client-render has access to it and renders the script with the nonce. This is
causes the warning and is even more problematic because it signifies a security
issue.

- The warning is because the browser clears the `nonce` to prevent XSS attacks
  and browser extensions inserting running scripts into the page.
- The security vulnerability is that if the client JavaScript has access to the
  `nonce` the only way it could get access is via the server rendered DOM which
  browser extensions would have access to, eliminating the security benefit of
  the `nonce`.

## Suggested solutions:

Update the error messages to explain the problem and solution.

- The `Extra attributes from the server: nonce` error message should be updated
  to explain issue with `nonce`. Maybe something like:
  `Extra attributes from the server: nonce. The nonce attribute is a security feature and should not be passed to the client. Instead, set the nonce attribute to an empty string when client rendering.`
  Alternatively, you could just not warn about the extra `nonce` attribute at
  all.
- The `Prop nonce did not match` error message should be updated to explain the
  issue with `nonce`. Maybe something like:
  `Prop nonce did not match. The nonce attribute is a security feature and should not be passed to the client as yours appears to do currently which makes your application vulnerable to cross-site scripting attacks. Instead, set the nonce attribute to an empty string when client rendering. Make certain to not send the nonce value in the DOM anywhere other than in the nonce attribute of scripts and links.`
  Whatever we do, we definitely want to make sure people are aware this is a
  serious security vulnerability.
