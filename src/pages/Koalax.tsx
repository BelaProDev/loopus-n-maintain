import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, FileText, Settings, Building2, Folder } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import KoalaxAuth from "./Koalax/KoalaxAuth";
import { useTranslation } from "react-i18next";

const CONTENT_TABS = [
  { id: "emails", label: "admin:email.title", icon: Mail, path: "/koalax/emails" },
  { id: "content", label: "admin:content.title", icon: FileText, path: "/koalax/content" },
];

const ADMIN_TABS = [
  { id: "settings", label: "admin:settings.title", icon: Settings, path: "/koalax/settings" },
  { id: "business", label: "admin:business.title", icon: Building2, path: "/koalax/business" },
  { id: "documents", label: "admin:documents.title", icon: Folder, path: "/koalax/documents" },
];

const Koalax = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation(["common", "admin"]);
  const allTabs = [...CONTENT_TABS, ...ADMIN_TABS];
  const currentTab = allTabs.find(tab => location.pathname.includes(tab.id))?.id || "emails";

  const checkKoalaxAuth = () => {
    const session = sessionStorage.getItem('koalax_auth');
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        if (sessionData.type === 'koalax' && sessionData.timestamp && sessionData.isAuthenticated) {
          return true;
        }
      } catch (error) {
        sessionStorage.removeItem('koalax_auth');
      }
    }
    return false;
  };

  const isAuthenticated = checkKoalaxAuth();

  useEffect(() => {
    if (!isAuthenticated && !location.pathname.includes('dropbox-callback')) {
      navigate('/koalax', { 
        replace: true,
        state: { from: location }
      });
    }
  }, [isAuthenticated, location, navigate]);

  if (!isAuthenticated) {
    return <KoalaxAuth />;
  }

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <Header />
      <div className="container mx-auto p-4 md:p-8 flex-1">
        <Tabs 
          value={currentTab} 
          onValueChange={(value) => {
            const tab = allTabs.find(t => t.id === value);
            if (tab) navigate(tab.path);
          }}
          className="space-y-4"
        >
          <div className="space-y-6">
            <ScrollArea className="w-full">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2 text-gray-500">{t("admin:contentManagement")}</h3>
                  <TabsList className="w-full flex flex-nowrap overflow-x-auto justify-start md:justify-start p-1">
                    {CONTENT_TABS.map(({ id, label, icon: Icon }) => (
                      <TabsTrigger key={id} value={id} className="whitespace-nowrap">
                        <Icon className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">{t(label)}</span>
                        <span className="sm:hidden">{t(label).split(' ')[0]}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2 text-gray-500">{t("admin:administration")}</h3>
                  <TabsList className="w-full flex flex-nowrap overflow-x-auto justify-start md:justify-start p-1">
                    {ADMIN_TABS.map(({ id, label, icon: Icon }) => (
                      <TabsTrigger key={id} value={id} className="whitespace-nowrap">
                        <Icon className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">{t(label)}</span>
                        <span className="sm:hidden">{t(label).split(' ')[0]}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>
            </ScrollArea>
            <Separator className="my-4" />
          </div>

          <div className="mt-4">
            <Outlet />
          </div>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Koalax;