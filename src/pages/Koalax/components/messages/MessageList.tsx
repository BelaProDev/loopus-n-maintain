import { useQuery } from "@tanstack/react-query";
import { contactQueries } from "@/lib/fauna/contactQueries";
import { ContactMessage } from "@/lib/fauna/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { useState } from "react";

interface MessageListProps {
  service: 'electrics' | 'plumbing' | 'ironwork' | 'woodwork' | 'architecture';
}

const MessageList = ({ service }: MessageListProps) => {
  const { t } = useTranslation(["admin", "services"]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', service],
    queryFn: () => contactQueries.getAllMessages(service)
  });

  if (isLoading) {
    return <div>{t("common:common.loading")}</div>;
  }

  const formatMessagePreview = (message: string) => {
    return message.length > 100 ? `${message.substring(0, 100)}...` : message;
  };

  return (
    <>
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin:messages.date")}</TableHead>
              <TableHead>{t("admin:messages.name")}</TableHead>
              <TableHead>{t("admin:messages.email")}</TableHead>
              <TableHead>{t("admin:messages.message")}</TableHead>
              <TableHead>{t("admin:messages.status")}</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell>
                  {message.createdAt && format(new Date(message.createdAt), 'PPp')}
                </TableCell>
                <TableCell>{message.name}</TableCell>
                <TableCell>{message.email}</TableCell>
                <TableCell className="max-w-md">
                  <p className="truncate">{formatMessagePreview(message.message)}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {message.status || 'new'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMessage(message)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="space-y-1">
              <div className="flex items-center justify-between">
                <span>{selectedMessage?.name}</span>
                <Badge variant="secondary">
                  {selectedMessage?.status || 'new'}
                </Badge>
              </div>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="mt-4 h-[400px] rounded-md border p-4">
            {selectedMessage?.message.split('\n').map((paragraph: string, index: number) => (
              <p key={index} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MessageList;