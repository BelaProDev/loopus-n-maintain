import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  createBrowserRouter,
  RouterProvider,
} from "@remix-run/react";
import Index from "./pages/Index";
import Electrics from "./pages/Electrics";
import Plumbing from "./pages/Plumbing";
import Ironwork from "./pages/Ironwork";
import Woodwork from "./pages/Woodwork";
import Architecture from "./pages/Architecture";
import Login from "./pages/Login";
import Koalax from "./pages/Koalax";
import App from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Index /> },
      { path: "login", element: <Login /> },
      { path: "electrics", element: <Electrics /> },
      { path: "plumbing", element: <Plumbing /> },
      { path: "ironwork", element: <Ironwork /> },
      { path: "woodwork", element: <Woodwork /> },
      { path: "architecture", element: <Architecture /> },
      { path: "koalax", element: <Koalax /> },
    ],
  },
]);

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <RouterProvider router={router} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}