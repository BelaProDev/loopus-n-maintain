import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MessageSquare, FileText, BarChart, Mic, Camera } from "lucide-react";
import ServiceCard from "@/components/home/ServiceCard";
import ToolCard from "@/components/home/ToolCard";
import HackerNewsSection from "@/components/home/HackerNewsSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold">{t("home.title")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <ServiceCard 
            title={t("services.architecture.title")}
            description={t("services.architecture.description")}
            to="/architecture"
            image="/images/services/architecture.jpg"
          />
          <ToolCard 
            icon={FileText}
            title={t("tools.documents.title")}
            description={t("tools.documents.description")}
            to="/tools/documents"
          />
          <div className="flex items-center border rounded-lg p-4">
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
            <Link to="/tools/chat" className="ml-2">
              {t("home.chat")}
            </Link>
          </div>
        </div>
        <HackerNewsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;