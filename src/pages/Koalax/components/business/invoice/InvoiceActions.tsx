import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Invoice } from "@/types/business";
import { useTranslation } from "react-i18next";

interface InvoiceActionsProps {
  invoice: Invoice;
  onExport: (invoice: Invoice, type: 'pdf' | 'docx') => void;
  onDelete: (id: string) => void;
}

const InvoiceActions = ({ invoice, onExport, onDelete }: InvoiceActionsProps) => {
  const { t } = useTranslation(["admin"]);

  return (
    <div className="space-x-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onExport(invoice, 'pdf')}
      >
        PDF
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onExport(invoice, 'docx')}
      >
        DOCX
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onDelete(invoice.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default InvoiceActions;