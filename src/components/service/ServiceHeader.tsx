import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

interface ServiceHeaderProps {
  title: string;
  description: string;
  imagePath?: string;
}

const ServiceHeader = ({ title, description, imagePath }: ServiceHeaderProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(["common", "auth"]);

  return (
    <>
      {!isAuthenticated && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription className="flex items-center justify-between flex-wrap gap-4">
            <span>{t("auth:required")}</span>
            <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
              {t("auth:signIn")}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      <div className="glass-effect rounded-lg p-4 md:p-8 mb-8">
        {imagePath && (
          <div className="w-full h-48 md:h-64 mb-4 overflow-hidden rounded-lg">
            <img src={imagePath} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-serif text-[#2E5984] mb-2 md:mb-4">{title}</h1>
        <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-8">{description}</p>
      </div>
    </>
  );
};

export default ServiceHeader;