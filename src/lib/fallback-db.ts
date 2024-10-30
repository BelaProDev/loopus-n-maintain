import fallbackData from './fallback-db.json';
import { toast } from "@/components/ui/use-toast";

export type Table = 'emails' | 'content' | 'clients' | 'providers' | 'invoices' | 'whatsapp-numbers';

interface StoredData<T> {
  version: string;
  lastSync: number;
  data: T[];
}

class FallbackDB {
  private storage: Map<string, StoredData<any>>;
  private prefix: string;
  private isServer: boolean;
  private version: string = '1';

  constructor(prefix: string = 'koalax_') {
    this.prefix = prefix;
    this.storage = new Map();
    this.isServer = typeof window === 'undefined';
    this.initializeStorage();
  }

  private initializeStorage() {
    Object.entries(fallbackData).forEach(([table, data]) => {
      const initialData: StoredData<any> = {
        version: this.version,
        lastSync: Date.now(),
        data: data
      };

      if (this.isServer) {
        this.storage.set(table, initialData);
      } else {
        const storedData = localStorage.getItem(`${this.prefix}${table}`);
        if (storedData) {
          const parsed = JSON.parse(storedData);
          // Handle version mismatch
          if (parsed.version !== this.version) {
            this.handleVersionMismatch(table, parsed);
          }
          this.storage.set(table, parsed);
        } else {
          this.storage.set(table, initialData);
        }
      }
    });
  }

  private handleVersionMismatch(table: string, storedData: StoredData<any>) {
    // Implement version migration logic here
    // For now, we'll just update the version and keep the data
    storedData.version = this.version;
    this.persistTable(table, storedData);
    
    toast({
      title: "Data Update",
      description: `${table} data has been updated to version ${this.version}`,
    });
  }

  private async persistTable(table: string, data: StoredData<any>) {
    if (this.isServer) return;
    
    try {
      localStorage.setItem(
        `${this.prefix}${table}`, 
        JSON.stringify({
          ...data,
          lastSync: Date.now()
        })
      );

      // Register for background sync if supported
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if ('sync' in registration) {
          await (registration as any).sync.register('db-sync');
        }
      }
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
    const storedData = this.storage.get(table);
    if (!storedData) return [];
    
    return Promise.resolve(storedData.data.filter(item => 
      Object.entries(query).every(([key, value]) => item[key] === value)
    ));
  }

  async findOne(table: Table, query: Record<string, any>) {
    const results = await this.find(table, query);
    return Promise.resolve(results[0] || null);
  }

  async insert(table: Table, data: any) {
    const storedData = this.storage.get(table) || {
      version: this.version,
      lastSync: Date.now(),
      data: []
    };
    
    const newItem = { ...data, id: crypto.randomUUID() };
    storedData.data.push(newItem);
    this.storage.set(table, storedData);
    await this.persistTable(table, storedData);
    
    return Promise.resolve({ insertedId: newItem.id });
  }

  async update(table: Table, query: Record<string, any>, update: Record<string, any>) {
    const storedData = this.storage.get(table);
    if (!storedData) return Promise.resolve({ modifiedCount: 0 });

    let modifiedCount = 0;
    const updatedData = {
      ...storedData,
      data: storedData.data.map(item => {
        if (Object.entries(query).every(([key, value]) => item[key] === value)) {
          modifiedCount++;
          return { ...item, ...update };
        }
        return item;
      })
    };

    this.storage.set(table, updatedData);
    await this.persistTable(table, updatedData);
    
    return Promise.resolve({ modifiedCount });
  }

  async delete(table: Table, query: Record<string, any>) {
    const storedData = this.storage.get(table);
    if (!storedData) return Promise.resolve({ deletedCount: 0 });

    const filteredData = {
      ...storedData,
      data: storedData.data.filter(item => 
        !Object.entries(query).every(([key, value]) => item[key] === value)
      )
    };

    const deletedCount = storedData.data.length - filteredData.data.length;
    this.storage.set(table, filteredData);
    await this.persistTable(table, filteredData);
    
    return Promise.resolve({ deletedCount });
  }

  async clearTable(table: Table) {
    const emptyData = {
      version: this.version,
      lastSync: Date.now(),
      data: []
    };
    this.storage.set(table, emptyData);
    await this.persistTable(table, emptyData);
    return Promise.resolve();
  }

  async clearAll() {
    this.storage.clear();
    this.initializeStorage();
    if (!this.isServer) {
      Object.keys(fallbackData).forEach(table => {
        localStorage.removeItem(`${this.prefix}${table}`);
      });
    }
    return Promise.resolve();
  }
}

export const fallbackDB = new FallbackDB();