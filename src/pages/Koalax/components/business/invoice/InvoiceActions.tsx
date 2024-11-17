import { MoreHorizontal, FileEdit, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Invoice } from "@/types/business";
import { useTranslation } from "react-i18next";
import { useDocumentExport } from "@/hooks/useDocumentExport";

interface InvoiceActionsProps {
  invoice: Invoice;
  onDelete: () => void;
  onEdit: () => void;
}

const InvoiceActions = ({ invoice, onDelete, onEdit }: InvoiceActionsProps) => {
  const { t } = useTranslation(["admin", "common"]);
  const { handleExport } = useDocumentExport();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <FileEdit className="mr-2 h-4 w-4" />
          {t("common:actions.edit")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport(invoice, 'pdf')}>
          <Download className="mr-2 h-4 w-4" />
          {t("common:actions.export")}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("common:actions.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InvoiceActions;