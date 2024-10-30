import { Navigate, RouteObject } from "react-router-dom";
import EmailManagement from "./components/email/EmailManagement";
import ContentEditor from "./ContentEditor";
import SiteSettings from "./SiteSettings";
import BusinessManagement from "./components/BusinessManagement";
import DocumentManager from "./components/DocumentManager";
import KoalaxAuth from "./KoalaxAuth";
import DropboxCallback from "./components/document/DropboxCallback";
import FallbackDbViewer from "./components/FallbackDbViewer";

export const koalaxRoutes: RouteObject[] = [
  {
    path: "/koalax",
    children: [
      { index: true, element: <Navigate to="/koalax/emails" replace /> },
      { path: "emails", element: <EmailManagement /> },
      { path: "content", element: <ContentEditor /> },
      { path: "settings", element: <SiteSettings /> },
      { path: "business", element: <BusinessManagement /> },
      { path: "documents", element: <DocumentManager /> },
      { path: "fallback-db", element: <FallbackDbViewer /> },
      { path: "dropbox-callback", element: <DropboxCallback /> },
    ],
  },
];