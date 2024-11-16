import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  path: string;
  gradient: string;
  bgClass: string;
}

const ToolCard = ({ icon: Icon, title, path, gradient, bgClass }: ToolCardProps) => {
  const { t } = useTranslation(["tools", "common"]);
  
  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 border-none overflow-hidden relative animate-scale-up ${bgClass} bg-opacity-5`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
      <Link to={path} className="block h-full">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="flex-1">{t(`tools:${title}.title`)}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-1">
          <p className="text-gray-600 dark:text-gray-300 mb-6 flex-1">
            {t(`tools:${title}.description`)}
          </p>
          <Button 
            variant="outline" 
            className="w-full group-hover:border-primary/50 transition-colors"
          >
            {t("common:actions.explore")}
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ToolCard;