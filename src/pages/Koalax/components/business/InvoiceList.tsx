import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Invoice } from "@/types/invoice";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { formatSafeDate } from "@/utils/dateUtils";

const InvoiceList = () => {
  const { toast } = useToast();
  const { t } = useTranslation(["admin", "common"]);
  const navigate = useNavigate();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: businessQueries.getInvoices
  });

  if (isLoading) return <div>{t("common:common.loading")}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/admin/business/invoices/new")}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("admin:business.invoices.add")}
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin:business.invoices.number")}</TableHead>
              <TableHead>{t("admin:business.invoices.date")}</TableHead>
              <TableHead>{t("admin:business.invoices.status")}</TableHead>
              <TableHead>{t("admin:business.invoices.amount")}</TableHead>
              <TableHead className="text-right">{t("common:common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice: Invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">#{invoice.number}</TableCell>
                <TableCell>{formatSafeDate(invoice.date)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {t(`admin:business.invoices.${invoice.status}`)}
                  </span>
                </TableCell>
                <TableCell className="font-mono">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: invoice.currency || 'EUR'
                  }).format(invoice.totalAmount)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/admin/business/invoices/${invoice.id}`)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // TODO: Implement delete
                      toast({
                        title: t("common:common.success"),
                        description: t("admin:business.invoices.deleteSuccess")
                      });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InvoiceList;