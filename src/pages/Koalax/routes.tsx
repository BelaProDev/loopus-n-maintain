import { RouteObject } from "react-router-dom";
import BusinessManagement from "./components/business/BusinessManagement";
import EmailManagement from "./components/email/EmailManagement";
import MessageManagement from "./components/messages/MessageManagement";
import WhatsAppSettings from "./components/WhatsAppSettings";
import LogoSettings from "./components/LogoSettings";
import InvoicePage from "./components/business/invoice/InvoicePage";
import MessageList from "./components/messages/MessageList";

export const koalaxRoutes: RouteObject[] = [
  {
    path: "/admin",
    children: [
      {
        path: "email",
        element: <EmailManagement />
      },
      {
        path: "settings",
        children: [
          { path: "whatsapp", element: <WhatsAppSettings /> },
          { path: "logo", element: <LogoSettings /> }
        ]
      },
      { 
        path: "business",
        children: [
          { index: true, element: <BusinessManagement /> },
          { path: "invoices/new", element: <InvoicePage /> },
          { path: "invoices/:invoiceId", element: <InvoicePage /> }
        ]
      },
      { 
        path: "messages", 
        children: [
          { index: true, element: <MessageManagement /> },
          { path: ":roomId", element: <MessageList /> }
        ]
      }
    ]
  }
];