import { Link, useParams, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart3, Music, Receipt, MessageSquare, Image, ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const toolsData = {
  documents: {
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    description: "Create, edit, and manage your documents with cloud storage integration.",
  },
  analytics: {
    icon: BarChart3,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    description: "Track and visualize your business metrics with interactive charts.",
  },
  audio: {
    icon: Music,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    description: "Professional audio recording and editing tools.",
  },
  invoicing: {
    icon: Receipt,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    description: "Create and manage invoices, track payments and clients.",
  },
  chat: {
    icon: MessageSquare,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    description: "Real-time messaging for team communication.",
  },
  "photo-gallery": {
    icon: Image,
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
    description: "Organize and edit your photos with powerful tools.",
  },
};

const Tools = () => {
  const { toolId } = useParams();
  const { t } = useTranslation(["tools", "common"]);

  // If a specific tool is selected, show coming soon or redirect
  if (toolId && toolsData[toolId as keyof typeof toolsData]) {
    const tool = toolsData[toolId as keyof typeof toolsData];
    const Icon = tool.icon;

    return (
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/tools">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common:back", "Back to Tools")}
          </Link>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className={`mx-auto w-20 h-20 rounded-2xl ${tool.bgColor} flex items-center justify-center mb-6`}>
            <Icon className={`h-10 w-10 ${tool.color}`} />
          </div>
          <h1 className="text-3xl font-bold mb-4">
            {t(`tools:${toolId}.title`, toolId)}
          </h1>
          <p className="text-muted-foreground mb-8">
            {tool.description}
          </p>
          <Card className="glass-panel">
            <CardContent className="py-12">
              <p className="text-lg text-muted-foreground">
                {t("tools:comingSoon", "This tool is being rebuilt with new features. Check back soon!")}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Show all tools list
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">
          {t("tools:title", "Digital Tools Suite")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("tools:subtitle", "Powerful tools to streamline your workflow and boost productivity")}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {Object.entries(toolsData).map(([id, tool], index) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/tools/${id}`}>
                <Card className="service-card h-full group cursor-pointer">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={`p-3 rounded-xl ${tool.bgColor} group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-6 w-6 ${tool.color}`} />
                    </div>
                    <CardTitle className="text-lg">
                      {t(`tools:${id}.title`, id)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      {tool.description}
                    </CardDescription>
                    <div className="mt-4 flex items-center text-sm text-primary">
                      {t("tools:explore", "Explore")}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
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

export default Tools;
