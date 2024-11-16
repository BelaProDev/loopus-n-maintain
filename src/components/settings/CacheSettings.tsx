import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { clearCache } from "@/lib/utils/cacheUtils";

export function CacheSettings() {
  const handleClearCache = async () => {
    const status = await clearCache();
    if (status === 'Cache cleared successfully') {
      toast.success("Cache cleared successfully");
    } else {
      toast.error("Failed to clear cache");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Cache Management</h3>
          <p className="text-sm text-muted-foreground">
            Clear the application cache to free up space and resolve any data inconsistencies
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleClearCache}
          className="ml-4"
        >
          Clear Cache
        </Button>
      </div>
    </div>
  );
}