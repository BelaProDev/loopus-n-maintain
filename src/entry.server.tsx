import { PassThrough } from "stream";
import { StaticRouter } from "react-router-dom/server";
import { renderToPipeableStream } from "react-dom/server";
import App from "./App";

const ABORT_DELAY = 5000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
) {
  return new Promise((resolve, reject) => {
    let didError = false;
    const body = new PassThrough();

    const { pipe, abort } = renderToPipeableStream(
      <StaticRouter location={request.url}>
        <App />
      </StaticRouter>,
      {
        onShellReady() {
          responseHeaders.set("Content-Type", "text/html");
          
          const responseStream = new ReadableStream({
            start(controller) {
              const reader = body.on('data', (chunk) => {
                controller.enqueue(chunk);
              });
              
              body.on('end', () => {
                controller.close();
              });

              body.on('error', (err) => {
                controller.error(err);
                reject(err);
              });
            },
          });

          resolve(
            new Response(responseStream, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          );
          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          didError = true;
          console.error(error);
        },
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}