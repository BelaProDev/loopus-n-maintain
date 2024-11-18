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
      <div className="text-center py-4 text-[#8E9196]">
        {t("admin:email.noEmails", "No emails found")}
      </div>
    );
  }

  return (
    <div className="border border-[#6E59A5] rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-[#1A1F2C]">
          <TableRow className="hover:bg-[#2A2F3C]">
            <TableHead className="text-[#9b87f5]">{t("admin:email.name")}</TableHead>
            <TableHead className="text-[#9b87f5]">{t("admin:email.email")}</TableHead>
            <TableHead className="text-[#9b87f5]">{t("admin:email.type")}</TableHead>
            <TableHead className="text-right text-[#9b87f5]">{t("admin:email.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emails.map((email) => (
            <TableRow 
              key={email.ref.id}
              className="hover:bg-[#2A2F3C] bg-[#1A1F2C]"
            >
              <TableCell className="font-medium text-[#D6BCFA]">{email.data.name}</TableCell>
              <TableCell className="text-[#D6BCFA]">{email.data.email}</TableCell>
              <TableCell className="text-[#D6BCFA]">{email.data.type}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(email)}
                  className="text-[#9b87f5] hover:text-[#7E69AB] hover:bg-[#2A2F3C]"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(email.ref.id)}
                  className="text-[#ea384c] hover:text-red-700 hover:bg-[#2A2F3C]"
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