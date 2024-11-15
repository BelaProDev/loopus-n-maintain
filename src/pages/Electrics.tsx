import ServiceLayout from "./ServiceLayout";
import { useTranslation } from "react-i18next";

const Electrics = () => {
  const { t } = useTranslation(["services"]);

  const commonIssues = [
    { id: "powerOutage", label: t("services:electrical.issues.powerOutage") },
    { id: "circuitBreaker", label: t("services:electrical.issues.circuitBreaker") },
    { id: "flickeringLights", label: t("services:electrical.issues.flickeringLights") },
    { id: "outletNotWorking", label: t("services:electrical.issues.outletNotWorking") },
  ];

  const faqs = [
    {
      question: "services:faq.electrical.safetyQ",
      answer: "services:faq.electrical.safetyA"
    },
    {
      question: "services:faq.electrical.costQ",
      answer: "services:faq.electrical.costA"
    },
    {
      question: "services:faq.electrical.emergencyQ",
      answer: "services:faq.electrical.emergencyA"
    }
  ];

  return (
    <ServiceLayout
      title={t("services:electrical.title")}
      description={t("services:electrical.description")}
      commonIssues={commonIssues}
      faqs={faqs}
    />
  );
};

export default Electrics;