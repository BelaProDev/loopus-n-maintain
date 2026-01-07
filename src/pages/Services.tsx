import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Wrench, Hammer, TreePine, Building2, ArrowLeft, Phone, Mail, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const serviceData = {
  electrical: {
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    features: ["Wiring & Rewiring", "Electrical Repairs", "Safety Inspections", "Lighting Installation", "Panel Upgrades"],
  },
  plumbing: {
    icon: Wrench,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    features: ["Pipe Repair", "Drain Cleaning", "Water Heater Service", "Fixture Installation", "Emergency Repairs"],
  },
  ironwork: {
    icon: Hammer,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    features: ["Custom Fabrication", "Structural Repairs", "Gates & Railings", "Welding Services", "Restoration"],
  },
  woodwork: {
    icon: TreePine,
    color: "text-green-600",
    bgColor: "bg-green-600/10",
    features: ["Custom Carpentry", "Furniture Repair", "Flooring Installation", "Cabinet Making", "Deck Building"],
  },
  architecture: {
    icon: Building2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    features: ["Design Consultation", "Building Plans", "Renovation Design", "3D Visualization", "Permit Assistance"],
  },
};

const Services = () => {
  const { serviceId } = useParams();
  const { t } = useTranslation(["services", "common"]);

  // If a specific service is selected, show detail view
  if (serviceId && serviceData[serviceId as keyof typeof serviceData]) {
    const service = serviceData[serviceId as keyof typeof serviceData];
    const Icon = service.icon;

    return (
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common:back", "Back to Services")}
          </Link>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className={`p-4 rounded-xl ${service.bgColor}`}>
              <Icon className={`h-12 w-12 ${service.color}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {t(`services:${serviceId}.title`, serviceId)}
              </h1>
              <p className="text-muted-foreground">
                {t(`services:${serviceId}.description`, `Professional ${serviceId} services`)}
              </p>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t("services:features", "What We Offer")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("services:contact", "Get a Quote")}</CardTitle>
              <CardDescription>
                {t("services:contactDesc", "Contact us for a free consultation")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1">
                <a href="tel:+32489127067">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </a>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <a href="mailto:pro.belalawson@gmail.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Us
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Show all services list
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">
          {t("services:title", "Our Services")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("services:subtitle", "Comprehensive maintenance solutions for residential and commercial properties")}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {Object.entries(serviceData).map(([id, service], index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/services/${id}`}>
                <Card className="service-card h-full text-center group cursor-pointer">
                  <CardHeader>
                    <div className={`mx-auto p-4 rounded-xl ${service.bgColor} group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-10 w-10 ${service.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-xl mb-2">
                      {t(`services:${id}.title`, id)}
                    </CardTitle>
                    <CardDescription>
                      {t(`services:${id}.description`, `Professional ${id} services`)}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Services;
