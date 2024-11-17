import { InvoiceItem } from "@/types/business";
import InvoiceItemsList from "../InvoiceItemsList";

interface InvoiceItemsProps {
  items: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
  currency: string;
}

const InvoiceItems = ({ items, onItemsChange, currency }: InvoiceItemsProps) => {
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
        // Recalculate total when quantity or unit price changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    });
    onItemsChange(updatedItems);
  };

  return (
    <InvoiceItemsList
      items={items}
      onAddItem={handleAddItem}
      onRemoveItem={handleRemoveItem}
      onUpdateItem={handleUpdateItem}
    />
  );
};

export default InvoiceItems;