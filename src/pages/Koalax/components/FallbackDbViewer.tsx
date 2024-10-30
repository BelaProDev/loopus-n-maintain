import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import fallbackDb from "@/lib/fallback-db.json";

const FallbackDbViewer = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Fallback Database</h2>
      <Card className="p-6">
        <ScrollArea className="h-[600px] w-full rounded-md">
          <pre className="text-sm whitespace-pre-wrap break-words">
            {JSON.stringify(fallbackDb, null, 2)}
          </pre>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default FallbackDbViewer;