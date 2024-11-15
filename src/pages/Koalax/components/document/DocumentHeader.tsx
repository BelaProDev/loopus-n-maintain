import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DocumentHeaderProps {
  isAuthenticated: boolean;
  onLogin: () => void;
}

const DocumentHeader = ({ isAuthenticated, onLogin }: DocumentHeaderProps) => {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-2xl font-bold">{t("admin:documents.title")}</h2>
      {!isAuthenticated && (
        <Button onClick={onLogin} className="w-full sm:w-auto">
          <LogIn className="w-4 h-4 mr-2" />
          {t("admin:documents.connect")}
        </Button>
      )}
    </div>
  );
};

export default DocumentHeader;