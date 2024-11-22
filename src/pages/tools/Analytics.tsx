import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Download, Filter, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BackToHome from "@/components/BackToHome";

const Analytics = () => {
  const { t } = useTranslation(["tools"]);
  const [timeRange, setTimeRange] = useState('week');
  const [dataType, setDataType] = useState('revenue');

  // Sample data - in a real app this would come from an API
  const data = [
    { name: 'Mon', revenue: 4000, users: 240, documents: 24 },
    { name: 'Tue', revenue: 3000, users: 198, documents: 18 },
    { name: 'Wed', revenue: 2000, users: 320, documents: 42 },
    { name: 'Thu', revenue: 2780, users: 280, documents: 31 },
    { name: 'Fri', revenue: 1890, users: 190, documents: 21 },
    { name: 'Sat', revenue: 2390, users: 167, documents: 12 },
    { name: 'Sun', revenue: 3490, users: 230, documents: 29 },
  ];

  const stats = [
    { title: 'Total Revenue', value: '$23,540', change: '+12.3%' },
    { title: 'Active Users', value: '1,625', change: '+4.2%' },
    { title: 'Documents Created', value: '177', change: '+8.1%' },
    { title: 'Storage Used', value: '42.8 GB', change: '+2.5%' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <BackToHome />
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">{t("analytics.title")}</h1>
              <p className="text-lg text-muted-foreground">
                {t("analytics.description")}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.title} className="p-4">
                <div className="text-sm text-muted-foreground">{stat.title}</div>
                <div className="text-2xl font-bold mt-1">{stat.value}</div>
                <div className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last period
                </div>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Performance Overview</h2>
              <div className="flex gap-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dataType} onValueChange={setDataType}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="users">Users</SelectItem>
                    <SelectItem value="documents">Documents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={dataType} 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Secondary Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Distribution Analysis</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" fill="#8884d8" />
                  <Bar dataKey="documents" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;