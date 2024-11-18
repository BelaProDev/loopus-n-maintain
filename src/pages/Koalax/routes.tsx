import { Navigate, RouteObject } from "react-router-dom";
import EmailManagement from "./components/email/EmailManagement";
import SiteSettings from "./SiteSettings";
import BusinessManagement from "./components/BusinessManagement";
import MessageManagement from "./components/messages/MessageManagement";

export const koalaxRoutes: RouteObject[] = [
  {
    path: "/admin",
    children: [
      { index: true, element: <Navigate to="/admin/emails" replace /> },
      { path: "emails", element: <EmailManagement /> },
      { path: "settings", element: <Navigate to="/admin/settings/whatsapp" replace /> },
      { path: "settings/:tab", element: <SiteSettings /> },
      { path: "business/*", element: <BusinessManagement /> },
      { path: "messages", element: <Navigate to="/admin/messages/electrics" replace /> },
      { path: "messages/:service", element: <MessageManagement /> },
    ],
  },
];