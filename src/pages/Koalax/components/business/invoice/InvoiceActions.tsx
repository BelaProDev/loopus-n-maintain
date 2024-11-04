import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { Invoice } from "@/types/business";
import { useTranslation } from "react-i18next";
import { useDocumentExport } from "@/hooks/useDocumentExport";

interface InvoiceActionsProps {
  invoice: Invoice;
  onDelete: (id: string) => void;
}

const InvoiceActions = ({ invoice, onDelete }: InvoiceActionsProps) => {
  const { t } = useTranslation(["admin"]);
  const { handleExport, isExporting } = useDocumentExport();

  return (
    <div className="space-x-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => handleExport(invoice, 'pdf')}
        disabled={isExporting}
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : 'PDF'}
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => handleExport(invoice, 'docx')}
        disabled={isExporting}
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : 'DOCX'}
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => handleExport(invoice, 'xlsx')}
        disabled={isExporting}
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : 'XLSX'}
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onDelete(invoice.id)}
        disabled={isExporting}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default InvoiceActions;