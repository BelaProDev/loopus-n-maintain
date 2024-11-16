import { Card } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const Analytics = () => {
  const { t } = useTranslation(["tools"]);

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: businessQueries.getInvoices
  });

  const monthlyData = invoices.reduce((acc: any[], invoice: any) => {
    const date = new Date(invoice.date);
    const month = date.toLocaleString('default', { month: 'short' });
    const existingMonth = acc.find(item => item.month === month);
    
    if (existingMonth) {
      existingMonth.amount += invoice.totalAmount;
      existingMonth.count += 1;
    } else {
      acc.push({ month, amount: invoice.totalAmount, count: 1 });
    }
    
    return acc;
  }, []);

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
                <h3 className="text-xl font-semibold text-center">Revenue Overview</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="amount" stroke="#2563eb" fill="#3b82f6" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <LineChart className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold text-center">Invoice Trends</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#16a34a" fill="#22c55e" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <PieChart className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold text-center">Data Insights</h3>
                <div className="space-y-2">
                  <p className="text-center text-2xl font-bold">
                    {invoices.length}
                  </p>
                  <p className="text-center text-sm text-gray-600">
                    Total Invoices
                  </p>
                  <p className="text-center text-2xl font-bold">
                    €{invoices.reduce((sum: number, inv: any) => sum + inv.totalAmount, 0).toFixed(2)}
                  </p>
                  <p className="text-center text-sm text-gray-600">
                    Total Revenue
                  </p>
                </div>
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