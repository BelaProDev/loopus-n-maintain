import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck, FileText, Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Invoice, Client } from "@/types/business";

const Invoicing = () => {
  const { t } = useTranslation(["tools"]);
  const navigate = useNavigate();

  const { data: invoices = [] } = useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: businessQueries.getInvoices,
    retry: 1,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    onSettled: (data, error) => {
      if (error) {
        toast.error("Failed to load invoices");
      } else if (data) {
        toast.success("Invoices loaded successfully");
      }
    }
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: businessQueries.getClients,
    retry: 1,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    onSettled: (data, error) => {
      if (error) {
        toast.error("Failed to load clients");
      } else if (data) {
        toast.success("Clients loaded successfully");
      }
    }
  });

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const pendingInvoices = invoices.filter((inv) => inv.status === 'pending').length;
  const overdueInvoices = invoices.filter((inv) => inv.status === 'overdue').length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl font-bold">{t("invoicing.title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("invoicing.description")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Button 
                  variant="outline" 
                  className="w-full h-32 flex flex-col items-center justify-center gap-2 group"
                  onClick={() => navigate("/koalax/business")}
                >
                  <FileCheck className="h-8 w-8 group-hover:text-primary transition-colors" />
                  <span className="font-semibold">Create Invoice</span>
                  <p className="text-sm text-muted-foreground">
                    Generate new invoices
                  </p>
                </Button>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Button 
                  variant="outline" 
                  className="w-full h-32 flex flex-col items-center justify-center gap-2 group"
                  onClick={() => navigate("/koalax/business")}
                >
                  <FileText className="h-8 w-8 group-hover:text-primary transition-colors" />
                  <span className="font-semibold">Manage Invoices</span>
                  <div className="text-sm text-muted-foreground text-center">
                    <p>{invoices.length} Active Invoices</p>
                    <p>{clients.length} Clients</p>
                  </div>
                </Button>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Button 
                  variant="outline" 
                  className="w-full h-32 flex flex-col items-center justify-center gap-2 group"
                  onClick={() => navigate("/koalax/business")}
                >
                  <Download className="h-8 w-8 group-hover:text-primary transition-colors" />
                  <span className="font-semibold">Download Reports</span>
                  <p className="text-sm text-muted-foreground">
                    Export financial reports
                  </p>
                </Button>
              </Card>
            </motion.div>
          </div>

          <Tabs defaultValue="overview" className="mt-8">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
                    <span className="text-2xl font-bold">€{totalRevenue.toFixed(2)}</span>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Pending Invoices</span>
                    <span className="text-2xl font-bold">{pendingInvoices}</span>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Overdue Invoices</span>
                    <span className="text-2xl font-bold text-destructive">{overdueInvoices}</span>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recent">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Latest Invoices</h3>
                <div className="space-y-4">
                  {invoices.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">No invoices found</div>
                  ) : (
                    invoices.slice(0, 5).map((invoice: Invoice) => (
                      <div key={invoice.id} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-lg transition-colors">
                        <div className="flex flex-col">
                          <span className="font-medium">#{invoice.number}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(invoice.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {invoice.status}
                          </span>
                          <span className="font-mono font-medium">€{invoice.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Invoicing;
