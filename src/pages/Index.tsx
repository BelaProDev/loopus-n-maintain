import { useTranslation } from "react-i18next";
import { FileText, BarChart, Mic, MessageCircle, Camera, FileSpreadsheet } from "lucide-react";
import ToolCard from "@/components/home/ToolCard";
import HackerNewsSection from "@/components/home/HackerNewsSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      </main>
      <Footer />
    </div>
  );
};

export default Index;