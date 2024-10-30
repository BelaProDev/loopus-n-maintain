import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database } from "lucide-react";
import fallbackDb from "@/lib/fallback-db.json";

const FallbackDbViewer = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Database className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Fallback Database</h2>
      </div>
      
      <Card className="p-6">
        <ScrollArea className="h-[600px] w-full rounded-md border">
          <pre className="p-4 text-sm font-mono whitespace-pre-wrap break-words bg-slate-50">
            {JSON.stringify(fallbackDb, null, 2)}
          </pre>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default FallbackDbViewer;