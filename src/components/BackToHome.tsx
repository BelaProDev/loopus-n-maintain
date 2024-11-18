import { Home } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BackToHome = () => {
  const { t } = useTranslation(["common"]);

  return (
    <Button
      variant="outline"
      size="sm"
      asChild
      className="mb-4"
    >
      <Link to="/" className="flex items-center gap-2">
        <Home className="h-4 w-4" />
        {t("common:nav.home")}
      </Link>
    </Button>
  );
};

export default BackToHome;