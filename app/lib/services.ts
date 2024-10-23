import { Building2, Wrench, Zap, Hammer, PencilRuler } from "lucide-react";
import texts from "~/data/website-texts.json";

export interface Service {
  icon: any;
  title: string;
  description: string;
  path: string;
}

export const services: Service[] = [
  {
    icon: Zap,
    title: texts.home.services.electrics.title,
    description: texts.home.services.electrics.description,
    path: "/electrics",
  },
  {
    icon: Wrench,
    title: texts.home.services.plumbing.title,
    description: texts.home.services.plumbing.description,
    path: "/plumbing",
  },
  {
    icon: Building2,
    title: texts.home.services.ironwork.title,
    description: texts.home.services.ironwork.description,
    path: "/ironwork",
  },
  {
    icon: Hammer,
    title: texts.home.services.woodwork.title,
    description: texts.home.services.woodwork.description,
    path: "/woodwork",
  },
  {
    icon: PencilRuler,
    title: texts.home.services.architecture.title,
    description: texts.home.services.architecture.description,
    path: "/architecture",
  },
];