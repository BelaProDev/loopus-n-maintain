import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  path: string;
  gradient: string;
  bgClass: string;
}

const ServiceCard = ({ icon: Icon, title, path, gradient, bgClass }: ServiceCardProps) => {
  const { t } = useTranslation(["services", "common"]);
  
  return (
    <Link to={path} className="block">
      <Card className={`group hover:shadow-xl transition-all duration-300 border-none overflow-hidden relative animate-scale-up ${bgClass} bg-opacity-5 h-full`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="flex-1">{t(`services:${title}.title`)}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-1">
          <p className="text-gray-600 dark:text-gray-300 mb-6 flex-1">
            {t(`services:${title}.description`)}
          </p>
          <div 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full group-hover:border-primary/50"
          >
            {t("common:actions.explore")}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ServiceCard;