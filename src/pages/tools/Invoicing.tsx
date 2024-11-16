import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck, FileText, Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";

const Invoicing = () => {
  const { t } = useTranslation(["tools"]);
  const navigate = useNavigate();

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: businessQueries.getInvoices
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: businessQueries.getClients
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">{t("invoicing.title")}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("invoicing.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Button 
                variant="outline" 
                className="w-full h-32 flex flex-col items-center justify-center gap-2 group"
                onClick={() => navigate("/koalax/business")}
              >
                <FileCheck className="h-8 w-8 group-hover:text-primary transition-colors" />
                <span>Create Invoice</span>
                <p className="text-sm text-muted-foreground">
                  Generate new invoices
                </p>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Button 
                variant="outline" 
                className="w-full h-32 flex flex-col items-center justify-center gap-2 group"
                onClick={() => navigate("/koalax/business")}
              >
                <FileText className="h-8 w-8 group-hover:text-primary transition-colors" />
                <span>Manage Invoices</span>
                <div className="text-sm text-muted-foreground text-center">
                  <p>{invoices.length} Active Invoices</p>
                  <p>{clients.length} Clients</p>
                </div>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Button 
                variant="outline" 
                className="w-full h-32 flex flex-col items-center justify-center gap-2 group"
                onClick={() => navigate("/koalax/business")}
              >
                <Download className="h-8 w-8 group-hover:text-primary transition-colors" />
                <span>Download Reports</span>
                <p className="text-sm text-muted-foreground">
                  Export financial reports
                </p>
              </Button>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Latest Invoices</h3>
                <div className="space-y-2">
                  {invoices.slice(0, 5).map((invoice: any) => (
                    <div key={invoice.id} className="flex justify-between items-center text-sm">
                      <span>{invoice.number}</span>
                      <span>€{invoice.totalAmount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Total Revenue</span>
                    <span className="font-semibold">
                      €{invoices.reduce((sum: number, inv: any) => sum + inv.totalAmount, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Clients</span>
                    <span className="font-semibold">{clients.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pending Invoices</span>
                    <span className="font-semibold">
                      {invoices.filter((inv: any) => inv.status === 'pending').length}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Invoicing;