import { Card } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Analytics = () => {
  const { t } = useTranslation(["tools"]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">{t("analytics.title")}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("analytics.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <BarChart className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold text-center">Performance Metrics</h3>
                <p className="text-gray-600 text-center">Track and analyze key performance indicators</p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <LineChart className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold text-center">Trend Analysis</h3>
                <p className="text-gray-600 text-center">Monitor trends and patterns over time</p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <PieChart className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold text-center">Data Visualization</h3>
                <p className="text-gray-600 text-center">Visualize data in meaningful ways</p>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;