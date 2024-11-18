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
  service: ContactMessage['service'];
}

type MessageWithRef = {
  ref: { id: string };
  data: ContactMessage;
};

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
            {(messages as MessageWithRef[]).map((message) => (
              <TableRow key={message.ref.id}>
                <TableCell>
                  {message.data.createdAt && format(new Date(message.data.createdAt), 'PPp')}
                </TableCell>
                <TableCell>{message.data.name}</TableCell>
                <TableCell>{message.data.email}</TableCell>
                <TableCell className="max-w-md">
                  <p className="truncate">{formatMessagePreview(message.data.message)}</p>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      message.data.status === 'new'
                        ? 'default'
                        : message.data.status === 'read'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {t(`admin:messages.status_${message.data.status}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMessage(message.data)}
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
                <Badge
                  variant={
                    selectedMessage?.status === 'new'
                      ? 'default'
                      : selectedMessage?.status === 'read'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {selectedMessage?.status && t(`admin:messages.status_${selectedMessage.status}`)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedMessage?.email}
              </p>
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