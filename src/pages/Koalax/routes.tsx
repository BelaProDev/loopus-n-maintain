import { Route, Routes } from "react-router-dom";
import BusinessManagement from "./components/BusinessManagement";
import InvoiceList from "./components/business/invoice/InvoiceList";
import InvoicePage from "./components/business/invoice/InvoicePage";

export const KoalaxRoutes = () => {
  return (
    <Routes>
      <Route path="business/*" element={<BusinessManagement />}>
        <Route index element={<InvoiceList />} />
        <Route path="invoices" element={<InvoiceList />} />
        <Route path="invoices/new" element={<InvoicePage />} />
        <Route path="invoices/:invoiceId" element={<InvoicePage />} />
      </Route>
    </Routes>
  );
};

export default KoalaxRoutes;