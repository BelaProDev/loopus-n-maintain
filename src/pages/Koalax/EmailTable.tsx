import { Email } from "@/hooks/useEmails";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EmailTableProps {
  emails: Email[] | undefined;
  onEdit: (email: Email) => void;
  onDelete: (id: string) => void;
}

const EmailTable = ({ emails, onEdit, onDelete }: EmailTableProps) => {
  const { t } = useTranslation(["admin"]);

  if (!emails?.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        {t("admin:email.noEmails")}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("admin:email.name")}</TableHead>
          <TableHead>{t("admin:email.email")}</TableHead>
          <TableHead>{t("admin:email.type")}</TableHead>
          <TableHead className="text-right">{t("admin:email.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {emails.map((email) => (
          <TableRow key={email.ref.id}>
            <TableCell>{email.data.name}</TableCell>
            <TableCell>{email.data.email}</TableCell>
            <TableCell>{email.data.type}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(email)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(email.ref.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EmailTable;