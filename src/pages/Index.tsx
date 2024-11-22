import { useTranslation } from "react-i18next";
import { FileText, BarChart, Mic, MessageCircle, Camera, FileSpreadsheet } from "lucide-react";
import { Tool } from "@/utils/toolUtils";
import ToolGrid from "@/components/tools/ToolGrid";
import HackerNewsSection from "@/components/home/HackerNewsSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Index = () => {
  const { t } = useTranslation(["tools", "common", "home"]);

  const tools: Tool[] = [
    {
      id: "documents",
      icon: FileText,
      title: t("tools:documents.title"),
      description: t("tools:documents.description"),
      to: "/tools/documents"
    },
    {
      id: "analytics",
      icon: BarChart,
      title: t("tools:analytics.title"),
      description: t("tools:analytics.description"),
      to: "/tools/analytics"
    },
    {
      id: "audio",
      icon: Mic,
      title: t("tools:audio.title"),
      description: t("tools:audio.description"),
      to: "/tools/audio"
    },
    {
      id: "chat",
      icon: MessageCircle,
      title: t("tools:chat.title"),
      description: t("tools:chat.description"),
      to: "/tools/chat"
    },
    {
      id: "photo-gallery",
      icon: Camera,
      title: t("tools:photoGallery.title"),
      description: t("tools:photoGallery.description"),
      to: "/tools/photo-gallery"
    },
    {
      id: "invoicing",
      icon: FileSpreadsheet,
      title: t("tools:invoicing.title"),
      description: t("tools:invoicing.description"),
      to: "/tools/invoicing"
    }
  ];

  const { data: recentActivities, isLoading } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: () => Promise.resolve([
      { id: 1, service: 'Electrical', action: 'Maintenance completed', time: '2h ago', path: '/electrics' },
      { id: 2, service: 'Plumbing', action: 'New request', time: '3h ago', path: '/plumbing' },
      { id: 3, service: 'Woodwork', action: 'Quote provided', time: '5h ago', path: '/woodwork' },
      { id: 4, service: 'Architecture', action: 'Design review', time: '6h ago', path: '/architecture' },
      { id: 5, service: 'Ironwork', action: 'Project started', time: '8h ago', path: '/ironwork' },
    ]),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="page-container">
      <Header />
      <main className="content-container">
        <div className="section-container">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl gradient-heading">
              {t("home:welcome")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("home:description")}
            </p>
          </div>

          <section className="glass-panel p-8 mb-12">
            <ToolGrid tools={tools} />
          </section>
          
          <section className="grid md:grid-cols-2 gap-8">
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-semibold mb-6">{t("home:news.latest")}</h2>
              <HackerNewsSection />
            </div>

            <div className="glass-panel p-6">
              <h2 className="text-2xl font-semibold mb-6">{t("home:services.recentActivities")}</h2>
              <div className="space-y-1">
                {!isLoading && recentActivities?.map((activity) => (
                  <Link 
                    key={activity.id}
                    to={activity.path}
                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {activity.service}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{activity.action}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;