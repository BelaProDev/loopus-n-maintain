import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Invoice } from "@/types/business";
import { formatSafeDate } from "@/utils/dateUtils";
import InvoiceStatus from "./InvoiceStatus";
import InvoiceActions from "./InvoiceActions";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";

interface InvoiceTableProps {
  invoices: Invoice[];
  onDelete: (id: string) => void;
  onEdit: (invoice: Invoice) => void;
}

const InvoiceTable = ({ invoices, onDelete, onEdit }: InvoiceTableProps) => {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <Card className="overflow-hidden border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">{t("admin:business.invoices.number")}</TableHead>
            <TableHead className="font-semibold">{t("admin:business.invoices.date")}</TableHead>
            <TableHead className="font-semibold">{t("admin:business.invoices.dueDate")}</TableHead>
            <TableHead className="font-semibold">{t("admin:business.invoices.amount")}</TableHead>
            <TableHead className="font-semibold">{t("admin:business.invoices.status")}</TableHead>
            <TableHead className="text-right font-semibold">{t("common:common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices?.map((invoice) => (
            <TableRow key={invoice.id} className="hover:bg-muted/50">
              <TableCell className="font-mono">{invoice.number}</TableCell>
              <TableCell>{formatSafeDate(invoice.date)}</TableCell>
              <TableCell>{formatSafeDate(invoice.dueDate)}</TableCell>
              <TableCell className="font-mono">€{invoice.totalAmount.toFixed(2)}</TableCell>
              <TableCell>
                <InvoiceStatus status={invoice.status} />
              </TableCell>
              <TableCell className="text-right">
                <InvoiceActions
                  invoice={invoice}
                  onDelete={() => onDelete(invoice.id)}
                  onEdit={() => onEdit(invoice)}
                />
              </TableCell>
            </TableRow>
          ))}
          {invoices.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                {t("admin:business.invoices.noInvoices")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default InvoiceTable;