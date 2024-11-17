import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck, FileText, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface InvoicingActionsProps {
  invoicesCount: number;
  clientsCount: number;
}

const InvoicingActions = ({ invoicesCount, clientsCount }: InvoicingActionsProps) => {
  const navigate = useNavigate();

  return (
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
              <p>{invoicesCount} Active Invoices</p>
              <p>{clientsCount} Clients</p>
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
  );
};

export default InvoicingActions;