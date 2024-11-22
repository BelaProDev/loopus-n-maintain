import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FileText, Download, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import BackToHome from "@/components/BackToHome";
import InvoicingHeader from "./invoicing/InvoicingHeader";
import InvoicingStats from "./invoicing/InvoicingStats";
import InvoicingActions from "./invoicing/InvoicingActions";
import RecentInvoices from "./invoicing/RecentInvoices";
import { useQuery } from "@tanstack/react-query";
import { invoiceService } from "@/services/invoiceService";

const Invoicing = () => {
  const { t } = useTranslation(["tools"]);
  const { toast } = useToast();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: invoiceService.getInvoices
  });

  const handleCreateInvoice = () => {
    toast({
      title: "Coming Soon",
      description: "Invoice creation will be available in the next update."
    });
  };

  const handleExportData = () => {
    toast({
      title: "Exporting Data",
      description: "Your invoice data is being prepared for export."
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <BackToHome />
        <div className="space-y-8">
          <InvoicingHeader />

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 max-w-xs"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Invoices</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button onClick={handleCreateInvoice} className="flex-1 md:flex-none">
                <Plus className="w-4 h-4 mr-2" />
                New Invoice
              </Button>
              <Button variant="outline" onClick={handleExportData} className="flex-1 md:flex-none">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <InvoicingStats invoices={invoices} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Invoices</h2>
                <RecentInvoices invoices={invoices} />
              </Card>
            </div>
            <div>
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <InvoicingActions 
                  invoicesCount={invoices.length} 
                  clientsCount={0} // This would come from a clients query in a real implementation
                />
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