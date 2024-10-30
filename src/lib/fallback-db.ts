import fallbackData from './fallback-db.json';
import { fauna } from './fauna';
import { toast } from "@/components/ui/use-toast";

export type Table = 'emails' | 'content' | 'clients' | 'providers' | 'invoices' | 'whatsapp-numbers';

class FallbackDB {
  async find(table: Table, query: Record<string, any> = {}) {
    try {
      // Try Fauna first
      const results = await fauna.find(table, query);
      return results;
    } catch (error) {
      console.error('Fallback to local data:', error);
      // Fallback to local data
      return fallbackData[table] || [];
    }
  }

  async findOne(table: Table, query: Record<string, any>) {
    const results = await this.find(table, query);
    return results[0] || null;
  }

  async insert(table: Table, data: any) {
    try {
      const result = await fauna.insert(table, data);
      return { insertedId: result.ref.id };
    } catch (error) {
      console.error('Insert failed:', error);
      toast({
        title: "Error",
        description: "Failed to save data. Using local storage as fallback.",
        variant: "destructive",
      });
      throw error;
    }
  }

  async update(table: Table, query: Record<string, any>, update: Record<string, any>) {
    try {
      const result = await fauna.update(table, query.id, update);
      return { modifiedCount: result ? 1 : 0 };
    } catch (error) {
      console.error('Update failed:', error);
      toast({
        title: "Error",
        description: "Failed to update data. Using local storage as fallback.",
        variant: "destructive",
      });
      throw error;
    }
  }

  async delete(table: Table, query: Record<string, any>) {
    try {
      const result = await fauna.delete(table, query.id);
      return { deletedCount: result ? 1 : 0 };
    } catch (error) {
      console.error('Delete failed:', error);
      toast({
        title: "Error",
        description: "Failed to delete data. Using local storage as fallback.",
        variant: "destructive",
      });
      throw error;
    }
  }
}

export const fallbackDB = new FallbackDB();