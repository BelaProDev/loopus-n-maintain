import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Documentation = () => {
  const { t } = useTranslation(["docs"]);
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1EA]">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="p-4 md:p-8">
          <h1 className="text-4xl font-bold mb-8">{t("docs:title")} 🌸</h1>
          
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 gap-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <h2 className="text-2xl font-semibold">{t("docs:overview.title")} 🌺</h2>
              <p className="text-gray-700">
                {t("docs:overview.description")}
              </p>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <h2 className="text-2xl font-semibold">{t("docs:features.title")} 🌷</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="text-xl font-semibold mb-4">Core Features</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    {["auth", "email", "content", "business", "documents", "languages"].map((feature) => (
                      <li key={feature}>{t(`docs:features.${feature}`)}</li>
                    ))}
                  </ul>
                </Card>
                <Card className="p-4">
                  <h3 className="text-xl font-semibold mb-4">Services</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Electrical Maintenance</li>
                    <li>Plumbing Services</li>
                    <li>Ironwork Solutions</li>
                    <li>Woodworking</li>
                    <li>Architectural Consulting</li>
                  </ul>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="space-y-6">
              <h2 className="text-2xl font-semibold">{t("docs:admin.title")} 🌹</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="text-xl font-semibold mb-4">{t("docs:admin.content.title")}</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>{t("docs:admin.content.edit")}</li>
                    <li>{t("docs:admin.content.offline")}</li>
                  </ul>
                </Card>
                <Card className="p-4">
                  <h3 className="text-xl font-semibold mb-4">{t("docs:admin.business.title")}</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>{t("docs:admin.business.clients")}</li>
                    <li>{t("docs:admin.business.providers")}</li>
                    <li>{t("docs:admin.business.documents")}</li>
                  </ul>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="technical" className="space-y-6">
              <h2 className="text-2xl font-semibold">Technical Details 🌻</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="text-xl font-semibold mb-4">PWA Features</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Offline Functionality</li>
                    <li>Push Notifications</li>
                    <li>Responsive Design</li>
                    <li>Document Caching</li>
                    <li>Status Indicators</li>
                  </ul>
                </Card>
                <Card className="p-4">
                  <h3 className="text-xl font-semibold mb-4">{t("docs:setup.title")}</h3>
                  <div className="bg-gray-100 p-4 rounded-md">
                    <pre className="overflow-x-auto text-sm">
{`# ${t("docs:setup.env")}
VITE_FAUNA_SECRET_KEY=
VITE_DROPBOX_ACCESS_TOKEN=`}
                    </pre>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;