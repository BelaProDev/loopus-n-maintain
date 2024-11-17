import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbNavProps {
  path: string[];
  onNavigate: (index: number) => void;
}

const BreadcrumbNav = ({ path, onNavigate }: BreadcrumbNavProps) => {
  return (
    <nav className="flex items-center space-x-1 px-2 py-1">
      <button
        onClick={() => onNavigate(-1)}
        className="flex items-center hover:text-primary transition-colors"
      >
        <Home className="h-4 w-4" />
      </button>
      {path.map((segment, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
          <button
            onClick={() => onNavigate(index)}
            className="hover:text-primary transition-colors"
          >
            {segment}
          </button>
        </div>
      ))}
    </nav>
  );
};

export default BreadcrumbNav;