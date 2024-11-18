import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/db/businessDb";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvoicingHeader from "./invoicing/InvoicingHeader";
import InvoicingStats from "./invoicing/InvoicingStats";
import InvoicingActions from "./invoicing/InvoicingActions";
import RecentInvoices from "./invoicing/RecentInvoices";

const Invoicing = () => {
  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: businessQueries.getInvoices,
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: businessQueries.getClients,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <InvoicingHeader />
        <InvoicingStats invoices={invoices} />
        <InvoicingActions 
          invoicesCount={invoices.length} 
          clientsCount={clients.length} 
        />
        <RecentInvoices invoices={invoices} />
      </main>
      <Footer />
    </div>
  );
};

export default Invoicing;