import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface FolderCreatorProps {
  newFolderName: string;
  onNewFolderNameChange: (value: string) => void;
  onCreateFolder: () => void;
}

const FolderCreator = ({ 
  newFolderName, 
  onNewFolderNameChange, 
  onCreateFolder 
}: FolderCreatorProps) => {
  const { t } = useTranslation(["admin"]);

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Input
        placeholder={t("admin:documents.newFolderPlaceholder")}
        value={newFolderName}
        onChange={(e) => onNewFolderNameChange(e.target.value)}
        className="w-full sm:w-auto sm:flex-1"
      />
      <Button 
        onClick={onCreateFolder}
        className="w-full sm:w-auto"
      >
        {t("admin:documents.createFolder")}
      </Button>
    </div>
  );
};

export default FolderCreator;