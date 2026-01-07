import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Zap, Wrench, Hammer, TreePine, Building2, 
  FileText, BarChart3, Music, Receipt, MessageSquare, Image,
  ArrowRight, CheckCircle2
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const services = [
  { id: "electrical", icon: Zap, color: "text-yellow-500" },
  { id: "plumbing", icon: Wrench, color: "text-blue-500" },
  { id: "ironwork", icon: Hammer, color: "text-orange-500" },
  { id: "woodwork", icon: TreePine, color: "text-green-600" },
  { id: "architecture", icon: Building2, color: "text-purple-500" },
];

const tools = [
  { id: "documents", icon: FileText, path: "/tools/documents" },
  { id: "analytics", icon: BarChart3, path: "/tools/analytics" },
  { id: "audio", icon: Music, path: "/tools/audio" },
  { id: "invoicing", icon: Receipt, path: "/tools/invoicing" },
  { id: "chat", icon: MessageSquare, path: "/tools/chat" },
  { id: "gallery", icon: Image, path: "/tools/photo-gallery" },
];

const features = [
  "Professional maintenance services",
  "Real-time project tracking",
  "Digital document management",
  "Integrated invoicing system",
  "Multi-language support",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Index = () => {
  const { t } = useTranslation(["home", "services", "tools"]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 hero-gradient opacity-10" />
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Loopus</span> & Maintain
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              {t("home:hero.subtitle", "Professional building maintenance services with modern digital tools")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-primary" asChild>
                <Link to="/contact">
                  {t("home:hero.cta", "Get Started")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/docs">
                  {t("home:hero.docs", "View Documentation")}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-wrap justify-center gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="flex items-center gap-2 text-sm md:text-base"
              >
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-heading mb-4">
              {t("home:services.title", "Our Services")}
            </h2>
            <p className="section-subheading mx-auto">
              {t("home:services.subtitle", "Comprehensive maintenance solutions for your property")}
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((service) => (
              <motion.div key={service.id} variants={itemVariants}>
                <Link to={`/services/${service.id}`}>
                  <Card className="service-card h-full text-center group cursor-pointer">
                    <CardHeader className="pb-2">
                      <service.icon className={`h-12 w-12 mx-auto ${service.color} group-hover:scale-110 transition-transform`} />
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-lg mb-2">
                        {t(`services:${service.id}.title`, service.id)}
                      </CardTitle>
                      <CardDescription>
                        {t(`services:${service.id}.description`, `Professional ${service.id} services`)}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Digital Tools Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-heading mb-4">
              {t("home:tools.title", "Digital Tools Suite")}
            </h2>
            <p className="section-subheading mx-auto">
              {t("home:tools.subtitle", "Powerful tools to manage your projects efficiently")}
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {tools.map((tool) => (
              <motion.div key={tool.id} variants={itemVariants}>
                <Link to={tool.path}>
                  <Card className="service-card h-full group cursor-pointer">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <tool.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">
                        {t(`tools:${tool.id}.title`, tool.id)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        {t(`tools:${tool.id}.description`, `Manage your ${tool.id}`)}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="glass-panel p-8 md:p-12 text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="section-heading mb-4">
              {t("home:cta.title", "Ready to Get Started?")}
            </h2>
            <p className="section-subheading mx-auto mb-8">
              {t("home:cta.subtitle", "Contact us today for a free consultation and quote")}
            </p>
            <Button size="lg" className="btn-primary" asChild>
              <Link to="/contact">
                {t("home:cta.button", "Contact Us")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
