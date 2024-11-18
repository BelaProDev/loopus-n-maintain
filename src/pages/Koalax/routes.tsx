import { RouteObject } from "react-router-dom";
import BusinessManagement from "./components/business/BusinessManagement";
import EmailManagement from "./components/email/EmailManagement";
import MessageManagement from "./components/messages/MessageManagement";
import WhatsAppSettings from "./components/WhatsAppSettings";
import LogoSettings from "./components/LogoSettings";
import InvoicePage from "./components/business/invoice/InvoicePage";
import InvoiceList from "./components/business/invoice/InvoiceList";
import ClientList from "./components/business/ClientList";
import ProviderList from "./components/business/ProviderList";

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
        element: <BusinessManagement />,
        children: [
          { path: "invoices", element: <InvoiceList /> },
          { path: "invoices/new", element: <InvoicePage /> },
          { path: "invoices/:invoiceId", element: <InvoicePage /> },
          { path: "clients", element: <ClientList /> },
          { path: "providers", element: <ProviderList /> }
        ]
      },
      { 
        path: "messages",
        element: <MessageManagement />
      }
    ]
  }
];