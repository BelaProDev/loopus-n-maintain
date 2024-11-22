import { Card } from "@/components/ui/card";
import { Invoice } from "@/types/invoice";
import { formatSafeDate } from "@/utils/dateUtils";
import { motion } from "framer-motion";

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
    <div className="space-y-4">
      {invoices.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No invoices found
        </div>
      ) : (
        invoices.slice(0, 5).map((invoice, index) => (
          <motion.div
            key={invoice.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="flex justify-between items-center p-4 hover:bg-muted/50 rounded-lg transition-colors group-hover:shadow-sm">
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
                <span className="font-mono font-medium">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: invoice.currency || 'EUR'
                  }).format(invoice.totalAmount)}
                </span>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default RecentInvoices;