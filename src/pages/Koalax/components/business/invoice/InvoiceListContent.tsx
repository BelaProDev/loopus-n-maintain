import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatSafeDate } from "@/utils/dateUtils";
import { useTranslation } from "react-i18next";
import type { Invoice } from "@/types/invoice";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface InvoiceListContentProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
}

const InvoiceListContent = ({ invoices, onEdit, onDelete }: InvoiceListContentProps) => {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-900">{t("admin:business.invoices.number")}</TableHead>
            <TableHead className="text-gray-900">{t("admin:business.invoices.date")}</TableHead>
            <TableHead className="text-gray-900">{t("admin:business.invoices.status")}</TableHead>
            <TableHead className="text-gray-900">{t("admin:business.invoices.amount")}</TableHead>
            <TableHead className="text-right text-gray-900">{t("common:common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice: Invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-mono text-gray-900">#{invoice.number}</TableCell>
              <TableCell className="text-gray-700">{formatSafeDate(invoice.date)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {t(`admin:business.invoices.${invoice.status}`)}
                </span>
              </TableCell>
              <TableCell className="font-mono text-gray-900">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: invoice.currency || 'EUR'
                }).format(invoice.totalAmount)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(invoice)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(invoice)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceListContent;