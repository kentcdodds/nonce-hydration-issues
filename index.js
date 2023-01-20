import http from "http";
import fs from "fs";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { getApp } from "./app.js";

http
  .createServer((req, res) => {
    const [urlPath, searchString] = req.url.split("?");
    switch (`${req.method} ${urlPath}`) {
      case "GET /": {
        const passNonce = new URLSearchParams(searchString).has("passNonce");
        const nonce = Math.random().toString(36).slice(2);
        res.setHeader("Content-Type", "text/html");
        res.setHeader("Content-Security-Policy", `script-src 'nonce-${nonce}'`);
        res.writeHead(200);
        const html = renderToString(
          React.createElement(getApp(React), { nonce, passNonce })
        );
        res.end(html);
        break;
      }
      case "GET /app.js": {
        res.setHeader("Content-Type", "text/javascript");
        res.writeHead(200);
        res.end(fs.readFileSync("./app.js", "utf8"));
        break;
      }
      case "GET /client.js": {
        res.setHeader("Content-Type", "text/javascript");
        res.writeHead(200);
        res.end(fs.readFileSync("./client.js", "utf8"));
        break;
      }
      default: {
        const filePath = req.url.slice(1);
        const fileExists = fs.existsSync(filePath);
        if (!fileExists && filePath.endsWith(".js")) {
          res.writeHead(404);
          res.end();
          break;
        }
        const fileContent = fs.readFileSync(filePath, "utf8");
        res.setHeader("Content-Type", "text/javascript");
        res.writeHead(200);
        res.end(fileContent);
        break;
      }
    }
  })
  .listen(process.env.PORT || 3333);
