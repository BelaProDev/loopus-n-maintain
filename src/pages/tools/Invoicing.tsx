import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import type { Invoice, Client } from "@/types/business";
import InvoicingHeader from "./invoicing/InvoicingHeader";
import InvoicingActions from "./invoicing/InvoicingActions";
import InvoicingStats from "./invoicing/InvoicingStats";
import RecentInvoices from "./invoicing/RecentInvoices";

const Invoicing = () => {
  const { data: invoices = [] } = useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: businessQueries.getInvoices,
    retry: 1,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    onError: () => {
      toast.error("Failed to load invoices");
    }
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: businessQueries.getClients,
    retry: 1,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    onError: () => {
      toast.error("Failed to load clients");
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <InvoicingHeader />
          <InvoicingActions 
            invoicesCount={invoices.length} 
            clientsCount={clients.length} 
          />

          <Tabs defaultValue="overview" className="mt-8">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <InvoicingStats invoices={invoices} />
            </TabsContent>

            <TabsContent value="recent">
              <RecentInvoices invoices={invoices} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Invoicing;