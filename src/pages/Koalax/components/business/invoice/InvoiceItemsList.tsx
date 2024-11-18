import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvoiceItem } from "@/types/invoice";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface InvoiceItemsListProps {
  items: InvoiceItem[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, field: keyof InvoiceItem, value: any) => void;
}

const InvoiceItemsList = ({ items, onAddItem, onRemoveItem, onUpdateItem }: InvoiceItemsListProps) => {
  const { t } = useTranslation(["admin"]);

  const units = [
    { value: 'unit', label: 'Unit' },
    { value: 'hour', label: 'Hour' },
    { value: 'day', label: 'Day' },
    { value: 'month', label: 'Month' },
    { value: 'piece', label: 'Piece' },
    { value: 'service', label: 'Service' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t("admin:business.invoices.items")}</h3>
        <Button type="button" onClick={onAddItem} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          {t("admin:business.invoices.addItem")}
        </Button>
      </div>
      
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="p-4 space-y-4">
            {/* First Level - Description and SKU */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-9">
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Input
                  placeholder={t("admin:business.invoices.description")}
                  value={item.description}
                  onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
                />
              </div>
              <div className="col-span-3">
                <label className="text-sm font-medium mb-1 block">SKU</label>
                <Input
                  placeholder="SKU"
                  value={item.sku}
                  onChange={(e) => onUpdateItem(item.id, 'sku', e.target.value)}
                />
              </div>
            </div>

            {/* Second Level - Unit and Quantity */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <label className="text-sm font-medium mb-1 block">Unit</label>
                <Select
                  value={item.unit}
                  onValueChange={(value) => onUpdateItem(item.id, 'unit', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(unit => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-6">
                <label className="text-sm font-medium mb-1 block">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  placeholder={t("admin:business.invoices.quantity")}
                  value={item.quantity}
                  onChange={(e) => onUpdateItem(item.id, 'quantity', Number(e.target.value))}
                />
              </div>
            </div>

            {/* Third Level - Price, VAT and Total */}
            <div className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-4">
                <label className="text-sm font-medium mb-1 block">Unit Price</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={t("admin:business.invoices.price")}
                  value={item.unitPrice}
                  onChange={(e) => onUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                />
              </div>
              <div className="col-span-3">
                <label className="text-sm font-medium mb-1 block">VAT %</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={item.vatRate}
                  onChange={(e) => onUpdateItem(item.id, 'vatRate', Number(e.target.value))}
                />
              </div>
              <div className="col-span-3">
                <label className="text-sm font-medium mb-1 block">Total</label>
                <div className="bg-muted/50 px-3 py-2 rounded-md text-right font-medium">
                  {item.total.toFixed(2)} €
                </div>
              </div>
              <div className="col-span-2 text-right">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveItem(item.id)}
                  className="hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InvoiceItemsList;