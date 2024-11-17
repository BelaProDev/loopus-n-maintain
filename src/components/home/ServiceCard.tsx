import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ServiceCardProps {
  title: string;
  description: string;
  to: string;
  image: string;
}

const ServiceCard = ({ title, description, to, image }: ServiceCardProps) => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast(t("common:auth.signInToAccess"));
    }
  };
  
  return (
    <Link to={to} onClick={handleClick} className="block group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="relative h-48">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
        </div>
        <CardHeader>
          <h3 className="text-xl font-semibold">{title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ServiceCard;