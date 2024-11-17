import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const BreadcrumbNav = ({ currentPath, onNavigate }: BreadcrumbNavProps) => {
  const pathSegments = currentPath.split('/').filter(Boolean);

  return (
    <nav className="flex items-center space-x-1 px-2 py-1">
      <button
        onClick={() => onNavigate('/')}
        className="flex items-center hover:text-primary transition-colors"
      >
        <Home className="h-4 w-4" />
      </button>
      {pathSegments.map((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        return (
          <div key={path} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            <button
              onClick={() => onNavigate(path)}
              className="hover:text-primary transition-colors"
            >
              {segment}
            </button>
          </div>
        );
      })}
    </nav>
  );
};

export default BreadcrumbNav;