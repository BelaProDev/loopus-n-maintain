import { Card } from "@/components/ui/card";
import { FileText, Download, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import BackToHome from "@/components/BackToHome";
import InvoicingHeader from "./invoicing/InvoicingHeader";
import InvoicingStats from "./invoicing/InvoicingStats";
import InvoicingActions from "./invoicing/InvoicingActions";
import RecentInvoices from "./invoicing/RecentInvoices";

const Invoicing = () => {
  const { t } = useTranslation(["tools"]);
  const { toast } = useToast();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateInvoice = () => {
    // This would open the invoice creation dialog in a real app
    toast({
      title: "Coming Soon",
      description: "Invoice creation will be available in the next update.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Exporting Data",
      description: "Your invoice data is being prepared for export.",
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
              <Input
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
                prefix={<Search className="w-4 h-4 text-muted-foreground" />}
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
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
              <Button onClick={handleCreateInvoice}>
                <Plus className="w-4 h-4 mr-2" />
                New Invoice
              </Button>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <InvoicingStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Invoices</h2>
                <RecentInvoices filterStatus={filterStatus} searchQuery={searchQuery} />
              </Card>
            </div>
            <div>
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <InvoicingActions />
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