import ServiceHeader from "@/components/service/ServiceHeader";
import ServiceForm from "@/components/service/ServiceForm";
import FAQSection from "@/components/service/FAQSection";
import { useTranslation } from "react-i18next";

const Woodwork = () => {
  const { t } = useTranslation(["services", "common"]);

  const commonIssues = [
    { id: "repairs", label: t("services:woodworking.issues.repairs") },
    { id: "restoration", label: t("services:woodworking.issues.restoration") },
    { id: "customWork", label: t("services:woodworking.issues.customWork") },
    { id: "installation", label: t("services:woodworking.issues.installation") }
  ];

  const faqs = [
    {
      question: "What types of wood repairs do you handle?",
      answer: "We handle all types of wood repairs including furniture restoration, structural repairs, surface damage, joint repairs, and custom woodworking solutions for both residential and commercial properties."
    },
    {
      question: "How long does wood restoration typically take?",
      answer: "The duration varies depending on the project scope. Simple repairs might take 1-2 days, while full restoration projects can take 1-2 weeks. We'll provide a detailed timeline during consultation."
    },
    {
      question: "Do you offer custom woodworking services?",
      answer: "Yes, we offer custom woodworking services including furniture design, built-in cabinets, custom shelving, and architectural woodwork. Each piece is crafted to meet your specific needs and preferences."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <ServiceHeader
        title={t("services:woodworking.title")}
        description={t("services:woodworking.description")}
        imagePath="/images/woodworking-service.jpg"
      />

      <div className="container mx-auto px-4 py-8">
        <ServiceForm
          service="woodworking"
          commonIssues={commonIssues}
        />

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default Woodwork;