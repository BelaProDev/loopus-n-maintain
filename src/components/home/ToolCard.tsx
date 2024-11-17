import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
}

const ToolCard = ({ icon: Icon, title, description, to }: ToolCardProps) => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  
  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast({
        title: t("common:auth.required"),
        description: t("common:auth.signInToAccess")
      });
    }
  };
  
  return (
    <Link to={to} onClick={handleClick} className="block">
      <Card className="group hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ToolCard;