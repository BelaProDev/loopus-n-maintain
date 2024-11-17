import { Card } from "@/components/ui/card";
import { Invoice } from "@/types/business";
import { formatSafeDate } from "@/utils/dateUtils";

interface RecentInvoicesProps {
  invoices: Invoice[];
}

const RecentInvoices = ({ invoices }: RecentInvoicesProps) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Latest Invoices</h3>
      <div className="space-y-4">
        {invoices.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No invoices found</div>
        ) : (
          invoices.slice(0, 5).map((invoice) => (
            <div 
              key={invoice.id} 
              className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-lg transition-colors"
            >
              <div className="flex flex-col">
                <span className="font-medium">#{invoice.number}</span>
                <span className="text-sm text-muted-foreground">
                  {formatSafeDate(invoice.date)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(invoice.status)}`}>
                  {invoice.status}
                </span>
                <span className="font-mono font-medium">€{invoice.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default RecentInvoices;