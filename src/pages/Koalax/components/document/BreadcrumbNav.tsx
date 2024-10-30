import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BreadcrumbNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const BreadcrumbNav = ({ currentPath, onNavigate }: BreadcrumbNavProps) => {
  // Remove "loopusandmaintain" from the path and split remaining segments
  const cleanPath = currentPath.replace('/loopusandmaintain', '');
  const paths = cleanPath.split('/').filter(Boolean);
  
  return (
    <div className="flex items-center gap-1 mb-4 text-sm">
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8"
        onClick={() => onNavigate('/loopusandmaintain')}
      >
        <Home className="h-4 w-4" />
      </Button>
      {paths.map((segment, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => onNavigate(`/loopusandmaintain/${paths.slice(0, index + 1).join('/')}`)}
          >
            {segment}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default BreadcrumbNav;