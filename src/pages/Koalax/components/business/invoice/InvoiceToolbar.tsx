import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

interface InvoiceToolbarProps {
  onCreateClick: () => void;
  onImportClick: () => void;
}

const InvoiceToolbar = ({ onCreateClick, onImportClick }: InvoiceToolbarProps) => {
  const { t } = useTranslation(["admin"]);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 className="text-2xl font-semibold tracking-tight">
        {t("admin:business.invoices.title")}
      </h2>
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={onImportClick} 
          variant="outline"
          className="h-9"
        >
          <Upload className="w-4 h-4 mr-2" />
          {t("admin:business.invoices.import")}
        </Button>
        <Button 
          onClick={onCreateClick}
          className="h-9"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("admin:business.invoices.add")}
        </Button>
      </div>
    </div>
  );
};

export default InvoiceToolbar;