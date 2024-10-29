import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContentGridProps {
  content: any[];
  onEdit: (content: any) => void;
}

const ContentGrid = ({ content, onEdit }: ContentGridProps) => {
  return (
    <ScrollArea className="h-[600px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {content?.map((item: any) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-sm">{item.key}</h4>
                  <span className="text-xs text-muted-foreground">{item.language}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{item.content}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ContentGrid;