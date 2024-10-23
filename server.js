import { createRequestHandler } from "@remix-run/node";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./src/App";

const handler = (request) => {
  return new Promise((resolve) => {
    const { pipe } = renderToPipeableStream(
      <StaticRouter location={request.url}>
        <App />
      </StaticRouter>,
      {
        onShellReady() {
          resolve(pipe);
        },
      }
    );
  });
};

export default createRequestHandler({ build: handler });