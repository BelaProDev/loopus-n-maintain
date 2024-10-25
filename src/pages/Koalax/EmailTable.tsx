import { Email } from "@/hooks/useEmails";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

interface EmailTableProps {
  emails: Email[] | undefined;
  onEdit: (email: Email) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const EmailTable = ({ emails, onEdit, onDelete, isDeleting }: EmailTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {emails?.map((email) => (
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
                disabled={isDeleting}
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