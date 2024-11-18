import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { InvoiceItem } from "@/types/invoice";
import { Plus, Trash2, Package } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

  const units = [
    { value: 'unit', label: 'Unit' },
    { value: 'hour', label: 'Hour' },
    { value: 'day', label: 'Day' },
    { value: 'month', label: 'Month' },
    { value: 'piece', label: 'Piece' },
    { value: 'service', label: 'Service' }
  ];

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

  return (
    <Card className="p-6 bg-muted/5">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">
              {t("admin:business.invoices.items")}
            </h3>
          </div>
          <Button
            onClick={handleAddItem}
            type="button"
            size="sm"
            className="text-xs"
          >
            <Plus className="w-4 h-4 mr-1" />
            {t("admin:business.invoices.addItem")}
          </Button>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead className="w-[300px]">Description</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>VAT</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    {item.unitPrice.toFixed(2)} {currency}
                  </TableCell>
                  <TableCell>{item.vatRate}%</TableCell>
                  <TableCell className="font-medium">
                    {item.total.toFixed(2)} {currency}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onItemsChange(items.filter(i => i.id !== item.id))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <Input
                    placeholder="SKU"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder={t("admin:business.invoices.itemDescription")}
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={newItem.unit}
                    onValueChange={(value) => setNewItem({ ...newItem, unit: value })}
                  >
                    <SelectTrigger className="h-8">
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
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Qty"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={newItem.vatRate}
                    onChange={(e) => setNewItem({ ...newItem, vatRate: Number(e.target.value) })}
                    className="h-8"
                  />
                </TableCell>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default InvoiceItems;