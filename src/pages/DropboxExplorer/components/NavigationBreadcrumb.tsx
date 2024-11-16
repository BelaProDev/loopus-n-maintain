import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Folder, ChevronRight } from "lucide-react";

interface NavigationBreadcrumbProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const NavigationBreadcrumb = ({ currentPath, onNavigate }: NavigationBreadcrumbProps) => {
  const pathParts = currentPath.split('/').filter(Boolean);
  
  return (
    <Breadcrumb className="py-4">
      <BreadcrumbItem>
        <BreadcrumbLink onClick={() => onNavigate('/')} className="flex items-center hover:text-primary transition-colors">
          <Folder className="w-4 h-4 mr-2" />
          Root
        </BreadcrumbLink>
      </BreadcrumbItem>
      {pathParts.map((part, index) => {
        const path = '/' + pathParts.slice(0, index + 1).join('/');
        return (
          <>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem key={path}>
              <BreadcrumbLink 
                onClick={() => onNavigate(path)}
                className="hover:text-primary transition-colors"
              >
                {part}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        );
      })}
    </Breadcrumb>
  );
};