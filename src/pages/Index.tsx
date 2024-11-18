import { useTranslation } from "react-i18next";
import { FileText, BarChart, Mic, MessageCircle, Camera, FileSpreadsheet } from "lucide-react";
import ToolCard from "@/components/home/ToolCard";
import HackerNewsSection from "@/components/home/HackerNewsSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const { t } = useTranslation(["tools"]);

  const tools = [
    {
      icon: FileText,
      title: t("documents.title"),
      description: t("documents.description"),
      to: "/tools/documents"
    },
    {
      icon: BarChart,
      title: t("analytics.title"),
      description: t("analytics.description"),
      to: "/tools/analytics"
    },
    {
      icon: Mic,
      title: t("audio.title"),
      description: t("audio.description"),
      to: "/tools/audio"
    },
    {
      icon: MessageCircle,
      title: t("chat.title"),
      description: t("chat.description"),
      to: "/tools/chat"
    },
    {
      icon: Camera,
      title: t("photoGallery.title"),
      description: t("photoGallery.description"),
      to: "/tools/photo-gallery"
    },
    {
      icon: FileSpreadsheet,
      title: t("invoicing.title"),
      description: t("invoicing.description"),
      to: "/tools/invoicing"
    }
  ];

  // Mock query for recent service activities
  const { data: recentActivities } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: () => Promise.resolve([
      { id: 1, service: 'Electrical', action: 'Maintenance completed', time: '2h ago' },
      { id: 2, service: 'Plumbing', action: 'New request', time: '3h ago' },
      { id: 3, service: 'Woodwork', action: 'Quote provided', time: '5h ago' },
      { id: 4, service: 'Architecture', action: 'Design review', time: '6h ago' },
      { id: 5, service: 'Ironwork', action: 'Project started', time: '8h ago' },
    ]),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-12">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard
              key={tool.title}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              to={tool.to}
            />
          ))}
        </section>
        
        <section className="bg-card rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">{t("common:news.latest")}</h2>
          <HackerNewsSection />
        </section>

        {/* Recent Service Activities */}
        <section className="mt-8">
          <Separator className="my-4" />
          <div className="max-w-2xl mx-auto">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">Recent Service Activities</h3>
            <div className="space-y-1">
              {recentActivities?.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-center justify-between py-1 text-sm text-muted-foreground hover:bg-accent/5 rounded-sm px-2 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {activity.service}
                    </Badge>
                    <span>{activity.action}</span>
                  </div>
                  <span className="text-xs">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;