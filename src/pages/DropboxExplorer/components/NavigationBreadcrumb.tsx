import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Folder } from "lucide-react";

interface NavigationBreadcrumbProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const NavigationBreadcrumb = ({ currentPath, onNavigate }: NavigationBreadcrumbProps) => {
  const pathParts = currentPath.split('/').filter(Boolean);
  
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink onClick={() => onNavigate('/')} className="flex items-center">
          <Folder className="w-4 h-4 mr-2" />
          Root
        </BreadcrumbLink>
      </BreadcrumbItem>
      {pathParts.map((part, index) => {
        const path = '/' + pathParts.slice(0, index + 1).join('/');
        return (
          <BreadcrumbItem key={path}>
            <BreadcrumbLink onClick={() => onNavigate(path)}>{part}</BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
};