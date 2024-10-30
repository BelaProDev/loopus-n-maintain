import fallbackData from './fallback-db.json';
import { toast } from "@/components/ui/use-toast";

export type Table = 'emails' | 'content' | 'clients' | 'providers' | 'invoices' | 'whatsapp-numbers';

class FallbackDB {
  private storage: Map<string, any[]>;
  private prefix: string;
  private isServer: boolean;

  constructor(prefix: string = 'koalax_') {
    this.prefix = prefix;
    this.storage = new Map();
    this.isServer = typeof window === 'undefined';
    this.initializeStorage();
  }

  private initializeStorage() {
    Object.entries(fallbackData).forEach(([table, data]) => {
      if (this.isServer) {
        this.storage.set(table, data);
      } else {
        const storedData = localStorage.getItem(`${this.prefix}${table}`);
        this.storage.set(table, storedData ? JSON.parse(storedData) : data);
      }
    });
  }

  private persistTable(table: string) {
    if (this.isServer) return;
    
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

  async find(table: Table, query: Record<string, any> = {}) {
    const data = this.storage.get(table) || [];
    return Promise.resolve(data.filter(item => 
      Object.entries(query).every(([key, value]) => item[key] === value)
    ));
  }

  async findOne(table: Table, query: Record<string, any>) {
    const results = await this.find(table, query);
    return Promise.resolve(results[0] || null);
  }

  async insert(table: Table, data: any) {
    const tableData = this.storage.get(table) || [];
    const newItem = { ...data, id: crypto.randomUUID() };
    tableData.push(newItem);
    this.storage.set(table, tableData);
    this.persistTable(table);
    return Promise.resolve({ insertedId: newItem.id });
  }

  async update(table: Table, query: Record<string, any>, update: Record<string, any>) {
    const tableData = this.storage.get(table) || [];
    let modifiedCount = 0;
    const updatedData = tableData.map(item => {
      if (Object.entries(query).every(([key, value]) => item[key] === value)) {
        modifiedCount++;
        return { ...item, ...update };
      }
      return item;
    });
    this.storage.set(table, updatedData);
    this.persistTable(table);
    return Promise.resolve({ modifiedCount });
  }

  async delete(table: Table, query: Record<string, any>) {
    const tableData = this.storage.get(table) || [];
    const filteredData = tableData.filter(item => 
      !Object.entries(query).every(([key, value]) => item[key] === value)
    );
    const deletedCount = tableData.length - filteredData.length;
    this.storage.set(table, filteredData);
    this.persistTable(table);
    return Promise.resolve({ deletedCount });
  }

  async clearTable(table: Table) {
    this.storage.set(table, []);
    this.persistTable(table);
    return Promise.resolve();
  }

  async clearAll() {
    this.storage.clear();
    this.initializeStorage();
    Object.keys(fallbackData).forEach(table => {
      localStorage.removeItem(`${this.prefix}${table}`);
    });
    return Promise.resolve();
  }
}

export const fallbackDB = new FallbackDB();