import ServiceLayout from "./ServiceLayout";
import { useTranslation } from "react-i18next";

const Electrics = () => {
  const { t } = useTranslation(["services"]);

  const commonIssues = [
    { id: "powerOutage", label: t("services:electrics.issues.powerOutage") },
    { id: "circuitBreaker", label: t("services:electrics.issues.circuitBreaker") },
    { id: "flickeringLights", label: t("services:electrics.issues.flickeringLights") },
    { id: "outletNotWorking", label: t("services:electrics.issues.outletNotWorking") },
  ];

  const faqs = [
    {
      question: "faq.electrics.safetyQ",
      answer: "faq.electrics.safetyA"
    },
    {
      question: "faq.electrics.costQ",
      answer: "faq.electrics.costA"
    },
    {
      question: "faq.electrics.emergencyQ",
      answer: "faq.electrics.emergencyA"
    }
  ];

  return (
    <ServiceLayout
      title={t("services:electrics.title")}
      description={t("services:electrics.description")}
      commonIssues={commonIssues}
      faqs={faqs}
    />
  );
};

export default Electrics;