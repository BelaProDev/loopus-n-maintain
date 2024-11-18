import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ExternalLink, TrendingUp, MessageCircle } from "lucide-react";
import { fetchTopHNStories, type HNStory } from "@/lib/utils/hackerNewsUtils";
import { Skeleton } from "@/components/ui/skeleton";

const HackerNewsSection = () => {
  const { data: stories, isLoading } = useQuery({
    queryKey: ['hnStories'],
    queryFn: () => fetchTopHNStories(5),
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stories?.map((story: HNStory) => (
        <Card key={story.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <a 
            href={story.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="space-y-2"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium line-clamp-2">{story.title}</h3>
              <ExternalLink className="h-4 w-4 flex-shrink-0 ml-2" />
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                {story.score} points
              </span>
              <span className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                {story.descendants} comments
              </span>
              <span>by {story.by}</span>
            </div>
          </a>
        </Card>
      ))}
    </div>
  );
};

export default HackerNewsSection;