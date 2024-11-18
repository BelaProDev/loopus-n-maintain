import { InvoiceItem } from "@/types/business";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Textarea } from "@/components/ui/textarea";

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
          updatedItem.total = Number(updatedItem.quantity) * Number(updatedItem.unitPrice);
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{t("admin:business.invoices.items")}</h3>
          <Button onClick={handleAddItem} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            {t("admin:business.invoices.addItem")}
          </Button>
        </div>

        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={item.id} className="bg-muted/50 p-6 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Item #{index + 1}</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(item.id)}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">SKU</label>
                  <Input
                    placeholder="SKU"
                    value={item.sku}
                    onChange={(e) => handleUpdateItem(item.id, 'sku', e.target.value)}
                    className="font-mono h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Unit</label>
                  <Select
                    value={item.unit}
                    onValueChange={(value) => handleUpdateItem(item.id, 'unit', value)}
                  >
                    <SelectTrigger className="h-12">
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder={t("admin:business.invoices.description")}
                  value={item.description}
                  onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                  className="min-h-[100px] resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                    className="font-mono h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Unit Price</label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                      className="pl-8 font-mono h-12"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {currency}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">VAT Rate</label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={item.vatRate}
                      onChange={(e) => handleUpdateItem(item.id, 'vatRate', Number(e.target.value))}
                      className="pr-8 font-mono h-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      %
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <p className="text-lg font-mono font-medium">
                  {t("admin:business.invoices.total")}: {currency} {(item.quantity * item.unitPrice).toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {t("admin:business.invoices.noItems")}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default InvoiceItems;