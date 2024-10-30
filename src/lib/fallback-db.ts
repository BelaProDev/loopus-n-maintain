import fallbackData from './fallback-db.json';
import { toast } from "@/components/ui/use-toast";

type Table = 'emails' | 'content' | 'clients' | 'providers' | 'invoices';

class FallbackDB {
  private storage: Map<string, any[]>;
  private prefix: string;

  constructor(prefix: string = 'koalax_') {
    this.prefix = prefix;
    this.storage = new Map();
    this.initializeStorage();
  }

  private initializeStorage() {
    Object.entries(fallbackData).forEach(([table, data]) => {
      const storedData = localStorage.getItem(`${this.prefix}${table}`);
      this.storage.set(table, storedData ? JSON.parse(storedData) : data);
    });
  }

  private persistTable(table: string) {
    try {
      localStorage.setItem(
        `${this.prefix}${table}`, 
        JSON.stringify(this.storage.get(table))
      );
    } catch (error) {
      console.error('Storage persistence failed:', error);
      toast({
        title: "Storage Error",
        description: "Failed to save data locally. Some changes might be lost.",
        variant: "destructive"
      });
    }
  }

  find(table: Table, query: Record<string, any> = {}) {
    const data = this.storage.get(table) || [];
    return data.filter(item => 
      Object.entries(query).every(([key, value]) => item[key] === value)
    );
  }

  findOne(table: Table, query: Record<string, any>) {
    return this.find(table, query)[0] || null;
  }

  insert(table: Table, data: any) {
    const tableData = this.storage.get(table) || [];
    const newItem = { ...data, id: crypto.randomUUID() };
    tableData.push(newItem);
    this.storage.set(table, tableData);
    this.persistTable(table);
    return { insertedId: newItem.id };
  }

  update(table: Table, query: Record<string, any>, update: Record<string, any>) {
    const tableData = this.storage.get(table) || [];
    const updatedData = tableData.map(item => {
      if (Object.entries(query).every(([key, value]) => item[key] === value)) {
        return { ...item, ...update };
      }
      return item;
    });
    this.storage.set(table, updatedData);
    this.persistTable(table);
    return { modifiedCount: 1 };
  }

  delete(table: Table, query: Record<string, any>) {
    const tableData = this.storage.get(table) || [];
    const filteredData = tableData.filter(item => 
      !Object.entries(query).every(([key, value]) => item[key] === value)
    );
    this.storage.set(table, filteredData);
    this.persistTable(table);
    return { deletedCount: tableData.length - filteredData.length };
  }

  clearTable(table: Table) {
    this.storage.set(table, []);
    this.persistTable(table);
  }

  clearAll() {
    this.storage.clear();
    this.initializeStorage();
    Object.keys(fallbackData).forEach(table => {
      localStorage.removeItem(`${this.prefix}${table}`);
    });
  }
}

export const fallbackDB = new FallbackDB();