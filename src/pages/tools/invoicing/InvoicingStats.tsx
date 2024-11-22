import { Card } from "@/components/ui/card";
import { Invoice } from "@/types/invoice";
import { motion } from "framer-motion";
import { TrendingUp, Clock, AlertTriangle } from "lucide-react";

interface InvoicingStatsProps {
  invoices: Invoice[];
}

const InvoicingStats = ({ invoices }: InvoicingStatsProps) => {
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const pendingInvoices = invoices.filter((inv) => inv.status === 'draft').length;
  const overdueInvoices = invoices.filter((inv) => inv.status === 'overdue').length;

  const stats = [
    {
      title: "Total Revenue",
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR'
      }).format(totalRevenue),
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Pending Invoices",
      value: pendingInvoices,
      icon: Clock,
      color: "text-blue-600"
    },
    {
      title: "Overdue Invoices",
      value: overdueInvoices,
      icon: AlertTriangle,
      color: "text-red-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </span>
                <span className="text-2xl font-bold">
                  {stat.value}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default InvoicingStats;