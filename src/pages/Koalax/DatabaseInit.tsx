import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { initializeDatabase } from "@/lib/mongodb/migration";

interface DatabaseInitProps {
  onInitialized: () => void;
}

const DatabaseInit = ({ onInitialized }: DatabaseInitProps) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const { toast } = useToast();

  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      await initializeDatabase();
      toast({
        title: "Success",
        description: "Database initialized successfully",
      });
      onInitialized();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize database. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-6 w-[400px]">
        <h2 className="text-2xl font-bold mb-4">Database Initialization</h2>
        <p className="text-gray-600 mb-6">
          Before using Koalax, we need to initialize the database with the required collections and indexes.
        </p>
        <Button 
          onClick={handleInitialize} 
          disabled={isInitializing}
          className="w-full"
        >
          {isInitializing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Initialize Database
        </Button>
      </Card>
    </div>
  );
};

export default DatabaseInit;