import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { AppProviders } from "~/components/providers/AppProviders";
import { ServiceWorkerInit } from "~/components/ServiceWorkerInit";

import styles from "~/styles/app.css";
import fontStyles from "~/styles/fonts.css";

export const links = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: fontStyles },
  { rel: "manifest", href: "/manifest.json" },
  { rel: "icon", href: "/masked-icon.svg" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({
    ENV: {
      NODE_ENV: process.env.NODE_ENV,
    },
  });
};

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#2E5984" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-[#F5F1EA]">
        <AppProviders>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
          <ServiceWorkerInit />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
            }}
          />
        </AppProviders>
      </body>
    </html>
  );
}