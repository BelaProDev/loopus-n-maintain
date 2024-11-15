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
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

interface MessageListProps {
  service: ContactMessage['service'];
}

const MessageList = ({ service }: MessageListProps) => {
  const { t } = useTranslation(["admin", "services"]);
  
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', service],
    queryFn: () => contactQueries.getAllMessages(service)
  });

  if (isLoading) {
    return <div>{t("common:common.loading")}</div>;
  }

  return (
    <Card className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("admin:messages.date")}</TableHead>
            <TableHead>{t("admin:messages.name")}</TableHead>
            <TableHead>{t("admin:messages.email")}</TableHead>
            <TableHead>{t("admin:messages.message")}</TableHead>
            <TableHead>{t("admin:messages.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.ref.id}>
              <TableCell>
                {message.data.createdAt && format(new Date(message.data.createdAt), 'PPp')}
              </TableCell>
              <TableCell>{message.data.name}</TableCell>
              <TableCell>{message.data.email}</TableCell>
              <TableCell className="max-w-md truncate">{message.data.message}</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default MessageList;