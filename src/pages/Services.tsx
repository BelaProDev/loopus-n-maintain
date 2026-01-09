import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Wrench, Hammer, TreePine, Building2, ArrowLeft, Phone, Mail, CheckCircle2, Clock, Shield, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ServiceRequestForm } from "@/components/service/ServiceRequestForm";

const serviceData = {
  electrical: {
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    title: "Electrical Services",
    description: "Professional electrical installations, repairs, and maintenance for residential and commercial properties.",
    features: [
      "Complete Wiring & Rewiring",
      "Electrical Panel Upgrades",
      "Lighting Design & Installation",
      "Safety Inspections & Certifications",
      "Smart Home Integration",
      "Emergency Electrical Repairs",
      "EV Charger Installation",
      "Surge Protection Systems"
    ],
    benefits: [
      { icon: Shield, text: "Licensed & Insured Electricians" },
      { icon: Clock, text: "24/7 Emergency Service" },
      { icon: Star, text: "5-Year Warranty on All Work" },
    ],
  },
  plumbing: {
    icon: Wrench,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    title: "Plumbing Services",
    description: "Expert plumbing solutions from leak repairs to complete bathroom renovations.",
    features: [
      "Leak Detection & Repair",
      "Drain Cleaning & Unclogging",
      "Water Heater Services",
      "Bathroom & Kitchen Plumbing",
      "Pipe Replacement & Repair",
      "Sewer Line Services",
      "Water Filtration Systems",
      "Emergency Plumbing 24/7"
    ],
    benefits: [
      { icon: Shield, text: "Certified Master Plumbers" },
      { icon: Clock, text: "Same-Day Service Available" },
      { icon: Star, text: "Satisfaction Guaranteed" },
    ],
  },
  ironwork: {
    icon: Hammer,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    title: "Ironwork & Metalwork",
    description: "Custom metal fabrication, structural repairs, and decorative ironwork.",
    features: [
      "Custom Gates & Railings",
      "Structural Steel Work",
      "Welding & Fabrication",
      "Wrought Iron Restoration",
      "Security Grilles & Bars",
      "Balcony & Stair Railings",
      "Metal Furniture & Fixtures",
      "Industrial Repairs"
    ],
    benefits: [
      { icon: Shield, text: "Certified Welders" },
      { icon: Clock, text: "Custom Design Consultation" },
      { icon: Star, text: "Durable, Long-Lasting Work" },
    ],
  },
  woodwork: {
    icon: TreePine,
    color: "text-green-600",
    bgColor: "bg-green-600/10",
    borderColor: "border-green-600/30",
    title: "Woodwork & Carpentry",
    description: "Expert carpentry services from custom furniture to complete home renovations.",
    features: [
      "Custom Furniture Design",
      "Kitchen Cabinet Installation",
      "Hardwood Flooring",
      "Deck & Patio Building",
      "Door & Window Installation",
      "Built-in Shelving & Storage",
      "Trim & Molding Work",
      "Wood Restoration & Repair"
    ],
    benefits: [
      { icon: Shield, text: "Master Craftsmen" },
      { icon: Clock, text: "On-Time Project Completion" },
      { icon: Star, text: "Premium Materials Used" },
    ],
  },
  architecture: {
    icon: Building2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    title: "Architecture & Design",
    description: "Professional architectural design and planning services for renovations and new constructions.",
    features: [
      "Architectural Design",
      "Building Plans & Blueprints",
      "3D Visualization & Rendering",
      "Renovation Planning",
      "Permit Application Assistance",
      "Interior Space Planning",
      "Sustainable Design Solutions",
      "Project Management"
    ],
    benefits: [
      { icon: Shield, text: "Licensed Architects" },
      { icon: Clock, text: "Comprehensive Planning" },
      { icon: Star, text: "Award-Winning Designs" },
    ],
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
            Back to Services
          </Link>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Service Header */}
          <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
            <div className={`p-6 rounded-2xl ${service.bgColor} ${service.borderColor} border`}>
              <Icon className={`h-16 w-16 ${service.color}`} />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3">{service.title}</h1>
              <p className="text-lg text-muted-foreground mb-4">{service.description}</p>
              <div className="flex flex-wrap gap-4">
                {service.benefits.map((benefit, index) => {
                  const BenefitIcon = benefit.icon;
                  return (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <BenefitIcon className="h-4 w-4 text-primary" />
                      <span>{benefit.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tabs for Features and Request Form */}
          <Tabs defaultValue="request" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="request">Request Service</TabsTrigger>
              <TabsTrigger value="features">What We Offer</TabsTrigger>
            </TabsList>

            <TabsContent value="request">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ServiceRequestForm serviceType={serviceId} serviceTitle={service.title} />
                </div>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Need Help Now?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button asChild className="w-full" size="lg">
                        <a href="tel:+32489127067">
                          <Phone className="mr-2 h-4 w-4" />
                          Call Now
                        </a>
                      </Button>
                      <Button variant="outline" asChild className="w-full" size="lg">
                        <a href="mailto:pro.belalawson@gmail.com">
                          <Mail className="mr-2 h-4 w-4" />
                          Email Us
                        </a>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className={`${service.bgColor} border ${service.borderColor}`}>
                    <CardContent className="p-4">
                      <p className="text-sm font-medium mb-2">Why Choose Us?</p>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Free estimates
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          No hidden fees
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Licensed professionals
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Satisfaction guaranteed
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle>Our {service.title} Include</CardTitle>
                  <CardDescription>
                    Comprehensive services tailored to your needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <CheckCircle2 className={`h-5 w-5 ${service.color} flex-shrink-0`} />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive maintenance solutions for residential and commercial properties. 
          Click any service to request a quote.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
                <Card className={`h-full text-center group cursor-pointer hover:shadow-xl transition-all duration-300 hover:border-primary/50 ${service.borderColor} border`}>
                  <CardHeader>
                    <div className={`mx-auto p-4 rounded-xl ${service.bgColor} group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-10 w-10 ${service.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                    <CardDescription className="mb-4">{service.description}</CardDescription>
                    <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Request Quote
                    </Button>
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