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
  const { t } = useTranslation(["admin", "common"]);

  if (!emails || emails.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        {t("admin:email.noEmails", "No emails found")}
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
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
              <TableCell className="font-medium">{email.data.name}</TableCell>
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
    </div>
  );
};

export default EmailTable;