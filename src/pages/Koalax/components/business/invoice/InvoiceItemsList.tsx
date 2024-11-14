import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvoiceItem } from "@/types/business";
import { useTranslation } from "react-i18next";

interface InvoiceItemsListProps {
  items: InvoiceItem[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, field: keyof InvoiceItem, value: any) => void;
}

const InvoiceItemsList = ({ items, onAddItem, onRemoveItem, onUpdateItem }: InvoiceItemsListProps) => {
  const { t } = useTranslation(["admin"]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t("admin:invoices.items")}</h3>
        <Button type="button" onClick={onAddItem} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          {t("admin:invoices.addItem")}
        </Button>
      </div>
      
      {items.map((item) => (
        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-5">
            <Input
              placeholder={t("admin:invoices.description")}
              value={item.description}
              onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              placeholder={t("admin:invoices.quantity")}
              value={item.quantity}
              onChange={(e) => onUpdateItem(item.id, 'quantity', Number(e.target.value))}
            />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              placeholder={t("admin:invoices.price")}
              value={item.unitPrice}
              onChange={(e) => onUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
            />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              value={item.total}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div className="col-span-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveItem(item.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvoiceItemsList;