import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ServiceHeaderProps {
  title: string;
  description: string;
}

const ServiceHeader = ({ title, description }: ServiceHeaderProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {!isAuthenticated && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription className="flex items-center justify-between flex-wrap gap-4">
            <span>Please log in to access all features and services.</span>
            <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
              Log In
            </Button>
          </AlertDescription>
        </Alert>
      )}
      <div className="glass-effect rounded-lg p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-serif text-[#2E5984] mb-2 md:mb-4">{title}</h1>
        <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-8">{description}</p>
      </div>
    </>
  );
};

export default ServiceHeader;