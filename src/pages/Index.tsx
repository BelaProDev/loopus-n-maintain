import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import { FileText, GitGraph, BarChart, Music, Building2, MessageSquare, Image } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";

const Index = () => {
  const { t } = useTranslation(["common", "services", "tools"]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <section>
          <h1 className="text-4xl font-bold mb-8">{t("common:welcome")}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              title={t("services:electrical.title")}
              description={t("services:electrical.description")}
              to="/electrics"
              image="/images/services/electrical.jpg"
            />
            <ServiceCard
              title={t("services:plumbing.title")}
              description={t("services:plumbing.description")}
              to="/plumbing"
              image="/images/services/plumbing.jpg"
            />
            <ServiceCard
              title={t("services:ironwork.title")}
              description={t("services:ironwork.description")}
              to="/ironwork"
              image="/images/services/ironwork.jpg"
            />
            <ServiceCard
              title={t("services:woodworking.title")}
              description={t("services:woodworking.description")}
              to="/woodwork"
              image="/images/services/woodworking.jpg"
            />
            <ServiceCard
              title={t("services:architecture.title")}
              description={t("services:architecture.description")}
              to="/architecture"
              image="/images/services/architecture.jpg"
            />
          </div>
        </section>
        
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8">{t("tools.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard
              title={t("tools.documents.title")}
              description={t("tools.documents.description")}
              icon={FileText}
              to="/tools/documents"
            />
            <ToolCard
              title={t("tools.diagrams.title")}
              description={t("tools.diagrams.description")}
              icon={GitGraph}
              to="/tools/diagrams"
            />
            <ToolCard
              title={t("tools.analytics.title")}
              description={t("tools.analytics.description")}
              icon={BarChart}
              to="/tools/analytics"
            />
            <ToolCard
              title={t("tools.audio.title")}
              description={t("tools.audio.description")}
              icon={Music}
              to="/tools/audio"
            />
            <ToolCard
              title={t("tools.business.title")}
              description={t("tools.business.description")}
              icon={Building2}
              to="/business"
            />
            <ToolCard
              title={t("tools.chat.title")}
              description={t("tools.chat.description")}
              icon={MessageSquare}
              to="/tools/chat"
            />
            <ToolCard
              title={t("tools.photoGallery.title")}
              description={t("tools.photoGallery.description")}
              icon={Image}
              to="/tools/photo-gallery"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
