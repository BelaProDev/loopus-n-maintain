import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { InvoiceItem } from "@/types/invoice";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InvoiceItemsProps {
  items: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
  currency: string;
}

const InvoiceItems = ({ items, onItemsChange, currency }: InvoiceItemsProps) => {
  const { t } = useTranslation(["admin", "common"]);
  const [newItem, setNewItem] = useState<Partial<InvoiceItem>>({
    description: "",
    quantity: 1,
    unitPrice: 0,
    vatRate: 21,
    sku: "",
    unit: "unit"
  });

  const handleAddItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const item: InvoiceItem = {
      id: crypto.randomUUID(),
      sku: newItem.sku || "",
      description: newItem.description || "",
      quantity: Number(newItem.quantity) || 0,
      unitPrice: Number(newItem.unitPrice) || 0,
      vatRate: Number(newItem.vatRate) || 21,
      total: (Number(newItem.quantity) || 0) * (Number(newItem.unitPrice) || 0),
      unit: newItem.unit || "unit"
    };
    onItemsChange([...items, item]);
    setNewItem({
      description: "",
      quantity: 1,
      unitPrice: 0,
      vatRate: 21,
      sku: "",
      unit: "unit"
    });
  };

  const handleRemoveItem = (id: string) => {
    onItemsChange(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    onItemsChange(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = Number(updatedItem.quantity) * Number(updatedItem.unitPrice);
        }
        return updatedItem;
      }
      return item;
    }));
  };

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
      <h3 className="text-lg font-semibold">{t("admin:business.invoices.items")}</h3>
      
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <Input
                  placeholder="SKU"
                  value={item.sku}
                  onChange={(e) => handleItemChange(item.id, 'sku', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  placeholder={t("admin:business.invoices.itemDescription")}
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                />
              </div>
              <div>
                <Select
                  value={item.unit}
                  onValueChange={(value) => handleItemChange(item.id, 'unit', value)}
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
              <div>
                <Input
                  type="number"
                  min="0"
                  placeholder={t("admin:business.invoices.quantity")}
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={t("admin:business.invoices.unitPrice")}
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-2 text-right text-sm text-muted-foreground">
              Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(item.total)}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 border-dashed">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <Input
              placeholder="SKU"
              value={newItem.sku}
              onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Input
              placeholder={t("admin:business.invoices.itemDescription")}
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
          </div>
          <div>
            <Select
              value={newItem.unit}
              onValueChange={(value) => setNewItem({ ...newItem, unit: value })}
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
          <div>
            <Input
              type="number"
              min="0"
              placeholder={t("admin:business.invoices.quantity")}
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
            />
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder={t("admin:business.invoices.unitPrice")}
              value={newItem.unitPrice}
              onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
            />
            <Button 
              onClick={handleAddItem}
              type="button"
              variant="outline"
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceItems;