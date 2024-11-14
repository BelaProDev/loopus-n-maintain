import ServiceHeader from "@/components/service/ServiceHeader";
import ServiceForm from "@/components/service/ServiceForm";
import FAQSection from "@/components/service/FAQSection";
import { useTranslation } from "react-i18next";

const Electrics = () => {
  const { t } = useTranslation(["services", "common"]);

  const commonIssues = [
    { id: "powerOutage", label: t("services:electrical.issues.powerOutage") },
    { id: "circuitBreaker", label: t("services:electrical.issues.circuitBreaker") },
    { id: "flickeringLights", label: t("services:electrical.issues.flickeringLights") },
    { id: "outletNotWorking", label: t("services:electrical.issues.outletNotWorking") }
  ];

  const faqs = [
    {
      question: "What should I do during a power outage?",
      answer: "First, check if your neighbors have power. If they do, check your circuit breakers. If not, contact your electricity provider. For emergency electrical repairs, our team is available 24/7."
    },
    {
      question: "How often should electrical systems be inspected?",
      answer: "We recommend a professional electrical inspection every 3-5 years for residential properties, and annually for commercial buildings. More frequent inspections may be needed for older systems."
    },
    {
      question: "What are signs of electrical problems?",
      answer: "Common signs include flickering lights, burning smells, hot outlets, frequent circuit breaker trips, buzzing sounds, and visible sparks. If you notice any of these, contact an electrician immediately."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <ServiceHeader
        title={t("services:electrical.title")}
        description={t("services:electrical.description")}
        imagePath="/images/electrical-service.jpg"
      />

      <div className="container mx-auto px-4 py-8">
        <ServiceForm
          service="electrical"
          commonIssues={commonIssues}
        />

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default Electrics;