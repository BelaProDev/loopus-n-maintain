import { Card } from "@/components/ui/card";
import { Invoice } from "@/types/business";

interface InvoicingStatsProps {
  invoices: Invoice[];
}

const InvoicingStats = ({ invoices }: InvoicingStatsProps) => {
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const pendingInvoices = invoices.filter((inv) => inv.status === 'pending').length;
  const overdueInvoices = invoices.filter((inv) => inv.status === 'overdue').length;

  return (
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
  );
};

export default InvoicingStats;