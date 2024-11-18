import { Navigate, RouteObject } from "react-router-dom";
import EmailManagement from "./components/email/EmailManagement";
import SiteSettings from "./SiteSettings";
import BusinessManagement from "./components/business/BusinessManagement";
import MessageManagement from "./components/messages/MessageManagement";
import WhatsAppSettings from "./components/WhatsAppSettings";
import LogoSettings from "./components/LogoSettings";
import MessageList from "./components/messages/MessageList";

export const koalaxRoutes: RouteObject[] = [
  {
    path: "/admin",
    children: [
      { index: true, element: <Navigate to="/admin/business" replace /> },
      { path: "emails", element: <EmailManagement /> },
      { 
        path: "settings", 
        element: <SiteSettings />,
        children: [
          { index: true, element: <Navigate to="/admin/settings/whatsapp" replace /> },
          { path: "whatsapp", element: <WhatsAppSettings /> },
          { path: "logo", element: <LogoSettings /> }
        ]
      },
      { 
        path: "business",
        element: <BusinessManagement />
      },
      { 
        path: "messages", 
        element: <MessageManagement />,
        children: [
          { index: true, element: <Navigate to="/admin/messages/electrics" replace /> },
          { path: "electrics", element: <MessageList service="electrics" /> },
          { path: "plumbing", element: <MessageList service="plumbing" /> },
          { path: "ironwork", element: <MessageList service="ironwork" /> },
          { path: "woodwork", element: <MessageList service="woodwork" /> },
          { path: "architecture", element: <MessageList service="architecture" /> }
        ]
      }
    ]
  }
];