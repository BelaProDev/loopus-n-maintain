import { InvoiceItem } from "@/types/business";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface InvoiceItemsProps {
  items: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
  currency: string;
}

const InvoiceItems = ({ items, onItemsChange, currency }: InvoiceItemsProps) => {
  const { t } = useTranslation(["admin"]);

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      sku: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      unit: "unit",
      vatRate: 21,
      total: 0
    };
    onItemsChange([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    onItemsChange(items.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    });
    onItemsChange(updatedItems);
  };

  const units = [
    { value: 'unit', label: t("admin:business.invoices.units.unit") },
    { value: 'hour', label: t("admin:business.invoices.units.hour") },
    { value: 'day', label: t("admin:business.invoices.units.day") },
    { value: 'piece', label: t("admin:business.invoices.units.piece") },
    { value: 'service', label: t("admin:business.invoices.units.service") }
  ];

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{t("admin:business.invoices.items")}</h3>
          <Button onClick={handleAddItem} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            {t("admin:business.invoices.addItem")}
          </Button>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-center bg-muted/50 p-4 rounded-lg">
              <div className="col-span-2">
                <Input
                  placeholder="SKU"
                  value={item.sku}
                  onChange={(e) => handleUpdateItem(item.id, 'sku', e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="col-span-3">
                <Input
                  placeholder={t("admin:business.invoices.description")}
                  value={item.description}
                  onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Select
                  value={item.unit}
                  onValueChange={(value) => handleUpdateItem(item.id, 'unit', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin:business.invoices.selectUnit")} />
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
                  value={item.quantity}
                  onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                  className="font-mono"
                />
              </div>
              <div className="col-span-2">
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                    className="pl-6 font-mono"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {currency}
                  </span>
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={item.vatRate}
                    onChange={(e) => handleUpdateItem(item.id, 'vatRate', Number(e.target.value))}
                    className="pr-6 font-mono"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
              <div className="col-span-1 flex justify-between items-center">
                <span className="font-mono font-medium">
                  {item.total.toFixed(2)} {currency}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(item.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default InvoiceItems;