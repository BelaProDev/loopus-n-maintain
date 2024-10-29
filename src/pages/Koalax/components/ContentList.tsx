import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { faunaQueries } from "@/lib/fauna";
import fallbackDb from "@/lib/fallback-db.json";

interface ContentListProps {
  storageType: "fauna" | "fallback";
}

const ContentList = ({ storageType }: ContentListProps) => {
  const { data: faunaContent, isLoading } = useQuery({
    queryKey: ['content', storageType],
    queryFn: () => storageType === "fauna" ? faunaQueries.getAllContent() : fallbackDb.content,
    enabled: storageType === "fauna"
  });

  const content = storageType === "fauna" ? faunaContent : fallbackDb.content;

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Content List</h3>
      <ScrollArea className="h-[600px] rounded-md border p-4">
        {content?.map((item: any) => (
          <div key={item.key} className="mb-4 p-4 border rounded">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium">{item.key}</span>
              <span className="text-sm text-muted-foreground">{item.language}</span>
            </div>
            <p className="text-sm text-muted-foreground">{item.content}</p>
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
};

export default ContentList;