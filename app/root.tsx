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
import { Toaster } from "~/components/ui/sonner";
import { AuthProvider } from "~/lib/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TooltipProvider } from "~/components/ui/tooltip";

import styles from "~/styles/app.css";
import fontStyles from "~/styles/fonts.css";

const queryClient = new QueryClient();

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
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-[#F5F1EA]">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Outlet />
              <ScrollRestoration />
              <Scripts />
              <LiveReload />
              {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
              <script
                dangerouslySetInnerHTML={{
                  __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
                }}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    if ('serviceWorker' in navigator) {
                      window.addEventListener('load', () => {
                        navigator.serviceWorker.register('/sw.js');
                      });
                    }
                  `,
                }}
              />
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}