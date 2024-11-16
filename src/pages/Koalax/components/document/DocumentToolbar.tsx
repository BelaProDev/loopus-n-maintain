import { Button } from "@/components/ui/button";
import { RefreshCw, LogOut, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface DocumentToolbarProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  onRefresh: () => void;
  onLogout: () => void;
  currentPath: string;
}

const DocumentToolbar = ({
  onFileSelect,
  isUploading,
  onRefresh,
  onLogout,
  currentPath,
}: DocumentToolbarProps) => {
  const { t } = useTranslation(["admin"]);

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" asChild>
        <label className="cursor-pointer">
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? t("admin:documents.uploading") : t("admin:documents.upload")}
          <input
            type="file"
            className="hidden"
            onChange={onFileSelect}
            disabled={isUploading}
          />
        </label>
      </Button>

      <Button variant="outline" onClick={onRefresh}>
        <RefreshCw className="w-4 h-4 mr-2" />
        {t("admin:documents.refresh")}
      </Button>

      <Button variant="outline" onClick={onLogout}>
        <LogOut className="w-4 h-4 mr-2" />
        {t("admin:documents.disconnect")}
      </Button>
    </div>
  );
};

export default DocumentToolbar;