import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Documentation = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1EA]">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="p-4 md:p-8">
          <h1 className="text-4xl font-bold mb-8">{t("docs.title")} 🌸</h1>
          
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">{t("docs.overview.title")} 🌺</h2>
            <p className="text-gray-700">
              {t("docs.overview.description")}
            </p>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold">{t("docs.features.title")} 🌷</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {["auth", "email", "content", "business", "documents", "languages"].map((feature) => (
                <li key={feature}>{t(`docs.features.${feature}`)}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold">{t("docs.admin.title")} 🌹</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                {t("docs.admin.content.title")}
                <ul className="list-disc pl-6 mt-2">
                  <li>{t("docs.admin.content.edit")}</li>
                  <li>{t("docs.admin.content.offline")}</li>
                </ul>
              </li>
              <li>
                {t("docs.admin.business.title")}
                <ul className="list-disc pl-6 mt-2">
                  <li>{t("docs.admin.business.clients")}</li>
                  <li>{t("docs.admin.business.providers")}</li>
                  <li>{t("docs.admin.business.documents")}</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">{t("docs.setup.title")} 🌻</h2>
            <Card className="bg-gray-100 p-4">
              <pre className="overflow-x-auto">
{`# ${t("docs.setup.env")}
VITE_FAUNA_SECRET_KEY=your-secret-key
VITE_DROPBOX_ACCESS_TOKEN=your-token
VITE_WHATSAPP_NUMBERS=your-numbers`}
              </pre>
            </Card>
          </section>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;