import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvoiceItem } from "@/types/business";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";

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
      
      <Card className="overflow-hidden">
        <div className="grid grid-cols-12 gap-2 bg-gray-100 p-2 text-sm font-medium">
          <div className="col-span-1">SKU</div>
          <div className="col-span-4">Description</div>
          <div className="col-span-1">Unit</div>
          <div className="col-span-1">Quantity</div>
          <div className="col-span-2">Unit Price</div>
          <div className="col-span-1">VAT %</div>
          <div className="col-span-1">Total</div>
          <div className="col-span-1"></div>
        </div>
        
        <div className="divide-y">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 p-2 items-center hover:bg-gray-50">
              <div className="col-span-1">
                <Input
                  placeholder="SKU"
                  value={item.sku}
                  onChange={(e) => onUpdateItem(item.id, 'sku', e.target.value)}
                />
              </div>
              <div className="col-span-4">
                <Input
                  placeholder={t("admin:business.invoices.description")}
                  value={item.description}
                  onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
                />
              </div>
              <div className="col-span-1">
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
              <div className="col-span-1">
                <Input
                  type="number"
                  min="1"
                  placeholder={t("admin:business.invoices.quantity")}
                  value={item.quantity}
                  onChange={(e) => onUpdateItem(item.id, 'quantity', Number(e.target.value))}
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={t("admin:business.invoices.price")}
                  value={item.unitPrice}
                  onChange={(e) => onUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                />
              </div>
              <div className="col-span-1">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={item.vatRate}
                  onChange={(e) => onUpdateItem(item.id, 'vatRate', Number(e.target.value))}
                />
              </div>
              <div className="col-span-1 text-right font-medium">
                {item.total.toFixed(2)} €
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
      </Card>
    </div>
  );
};

export default InvoiceItemsList;