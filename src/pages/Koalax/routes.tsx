import { Navigate, RouteObject } from "react-router-dom";
import EmailManagement from "./components/email/EmailManagement";
import SiteSettings from "./SiteSettings";
import BusinessManagement from "./components/BusinessManagement";
import MessageManagement from "./components/messages/MessageManagement";

export const koalaxRoutes: RouteObject[] = [
  {
    path: "/koalax",
    children: [
      { index: true, element: <Navigate to="/koalax/emails" replace /> },
      { path: "emails", element: <EmailManagement /> },
      { path: "settings", element: <SiteSettings /> },
      { path: "business", element: <BusinessManagement /> },
      { path: "messages", element: <MessageManagement /> },
    ],
  },
];