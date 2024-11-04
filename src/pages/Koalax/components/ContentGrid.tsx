import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface ContentItem {
  key: string;
  type: 'text' | 'textarea' | 'wysiwyg';
  content: string;
  language: string;
  lastModified: number;
  modifiedBy: string;
}

interface ContentGridProps {
  content: ContentItem[];
  onEdit: (content: ContentItem) => void;
}

const ContentGrid = ({ content, onEdit }: ContentGridProps) => {
  const { t } = useTranslation(["admin"]);

  const getTypeColor = (type: ContentItem['type']) => {
    switch (type) {
      case 'text':
        return 'bg-blue-100 text-blue-800';
      case 'textarea':
        return 'bg-green-100 text-green-800';
      case 'wysiwyg':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ScrollArea className="h-[600px] w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <AnimatePresence>
          {content?.map((item) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col"
            >
              <Card className="p-4 hover:shadow-lg transition-shadow h-full">
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm truncate max-w-[200px]">
                      {item.key}
                    </h4>
                    <Badge variant="secondary" className={getTypeColor(item.type)}>
                      {t(`admin:content.types.${item.type}`)}
                    </Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEdit(item)}
                    title={t("admin:content.edit")}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {item.content}
                </p>
                
                <div className="mt-auto pt-4 border-t space-y-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(item.lastModified, 'PPp')}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <User className="h-3 w-3 mr-1" />
                    {t("admin:content.modifiedBy", { user: item.modifiedBy })}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
};

export default ContentGrid;