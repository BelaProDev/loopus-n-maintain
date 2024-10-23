import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Wrench, Zap, Hammer, PencilRuler } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const services = [
  {
    icon: Zap,
    title: "Electrics",
    description: "Professional electrical maintenance and repairs",
    path: "/electrics",
  },
  {
    icon: Wrench,
    title: "Plumbing",
    description: "Expert plumbing solutions and maintenance",
    path: "/plumbing",
  },
  {
    icon: Building2,
    title: "Ironwork",
    description: "Structural and decorative ironwork services",
    path: "/ironwork",
  },
  {
    icon: Hammer,
    title: "Woodwork",
    description: "Custom woodworking and carpentry services",
    path: "/woodwork",
  },
  {
    icon: PencilRuler,
    title: "Architecture",
    description: "Architectural design and planning",
    path: "/architecture",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1EA]">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-[#2E5984] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Professional Maintenance Management
              </h1>
              <p className="text-xl mb-8">
                Streamline your maintenance operations across multiple disciplines
              </p>
              <Button asChild size="lg" className="bg-white text-[#2E5984] hover:bg-gray-100">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#2E5984]">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <service.icon className="h-8 w-8 text-[#2E5984]" />
                    <CardTitle>{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={service.path}>Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;