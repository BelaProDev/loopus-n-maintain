import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const BreadcrumbNav = ({ currentPath, onNavigate }: BreadcrumbNavProps) => {
  const pathParts = currentPath.split('/').filter(Boolean);

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        onClick={() => onNavigate('/')}
        className="flex items-center hover:text-blue-500"
      >
        <Home className="w-4 h-4" />
      </button>

      {pathParts.map((part, index) => {
        const path = '/' + pathParts.slice(0, index + 1).join('/');
        return (
          <div key={path} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
            <button
              onClick={() => onNavigate(path)}
              className="hover:text-blue-500"
            >
              {part}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default BreadcrumbNav;