import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Settings, Building2, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import KoalaxAuth from "./Koalax/KoalaxAuth";
import { useTranslation } from "react-i18next";

const ADMIN_TABS = [
  { id: "emails", label: "admin:email.title", icon: Mail, path: "/admin/emails" },
  { id: "settings", label: "admin:settings.title", icon: Settings, path: "/admin/settings" },
  { id: "business", label: "admin:business.title", icon: Building2, path: "/admin/business" },
  { id: "messages", label: "admin:messages.title", icon: MessageSquare, path: "/admin/messages" },
];

const Koalax = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation(["common", "admin"]);
  const currentPath = location.pathname.split('/').pop() || "emails";
  const currentTab = ADMIN_TABS.find(tab => location.pathname.includes(tab.id))?.id || "emails";

  const checkKoalaxAuth = () => {
    const session = sessionStorage.getItem('koalax_auth');
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        return sessionData.type === 'koalax' && sessionData.timestamp && sessionData.isAuthenticated;
      } catch (error) {
        sessionStorage.removeItem('koalax_auth');
      }
    }
    return false;
  };

  const isAuthenticated = checkKoalaxAuth();

  useEffect(() => {
    if (!isAuthenticated && !location.pathname.includes('dropbox-callback')) {
      const currentPath = location.pathname;
      if (currentPath !== '/admin') {
        navigate('/admin', { 
          replace: true,
          state: { from: location }
        });
      }
    }
  }, [isAuthenticated, location.pathname]);

  if (!isAuthenticated && !location.pathname.includes('dropbox-callback')) {
    return <KoalaxAuth />;
  }

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <Header />
      <div className="container mx-auto p-4 md:p-8 flex-1">
        <Tabs 
          value={currentTab} 
          onValueChange={(value) => {
            const tab = ADMIN_TABS.find(t => t.id === value);
            if (tab) navigate(tab.path);
          }}
          className="space-y-4"
        >
          <div className="space-y-6">
            <ScrollArea className="w-full">
              <div className="space-y-4">
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
