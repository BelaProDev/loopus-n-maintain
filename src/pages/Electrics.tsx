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
      question: "faq.electrical.safetyQ",
      answer: "faq.electrical.safetyA"
    },
    {
      question: "faq.electrical.costQ",
      answer: "faq.electrical.costA"
    },
    {
      question: "faq.electrical.emergencyQ",
      answer: "faq.electrical.emergencyA"
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