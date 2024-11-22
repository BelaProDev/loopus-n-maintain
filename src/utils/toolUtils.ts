import { LucideIcon } from "lucide-react";

export interface Tool {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
}

export const isToolAccessible = (isAuthenticated: boolean): boolean => {
  return isAuthenticated;
};

export const handleToolAccess = (isAuthenticated: boolean, callback: () => void) => {
  if (isAuthenticated) {
    callback();
  }
};