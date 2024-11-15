import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Invoice } from "@/types/business";
import { format, isValid, parseISO } from "date-fns";
import InvoiceStatus from "./InvoiceStatus";
import InvoiceActions from "./InvoiceActions";
import { useTranslation } from "react-i18next";

interface InvoiceTableProps {
  invoices: Invoice[];
  onDelete: (id: string) => void;
}

const InvoiceTable = ({ invoices, onDelete }: InvoiceTableProps) => {
  const { t } = useTranslation(["admin", "common"]);

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'PPP') : 'Invalid date';
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("admin:business.invoices.number")}</TableHead>
          <TableHead>{t("admin:business.invoices.date")}</TableHead>
          <TableHead>{t("admin:business.invoices.dueDate")}</TableHead>
          <TableHead>{t("admin:business.invoices.amount")}</TableHead>
          <TableHead>{t("admin:business.invoices.status")}</TableHead>
          <TableHead className="text-right">{t("common:common.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices?.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.number}</TableCell>
            <TableCell>{formatDate(invoice.date)}</TableCell>
            <TableCell>{formatDate(invoice.dueDate)}</TableCell>
            <TableCell>€{invoice.totalAmount.toFixed(2)}</TableCell>
            <TableCell>
              <InvoiceStatus status={invoice.status} />
            </TableCell>
            <TableCell className="text-right">
              <InvoiceActions
                invoice={invoice}
                onDelete={() => onDelete(invoice.id)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InvoiceTable;