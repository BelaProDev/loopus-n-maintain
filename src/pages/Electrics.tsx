import ServiceLayout from "./ServiceLayout";
import { useTranslation } from "react-i18next";

const Electrics = () => {
  const { t } = useTranslation();

  const commonIssues = [
    { id: "powerOutage", label: t("services.electrical.issues.powerOutage") },
    { id: "circuitBreaker", label: t("services.electrical.issues.circuitBreaker") },
    { id: "flickeringLights", label: t("services.electrical.issues.flickeringLights") },
    { id: "outletNotWorking", label: t("services.electrical.issues.outletNotWorking") },
  ];

  const faqs = [
    {
      question: "services.faq.powerOutageQ",
      answer: "services.faq.powerOutageA"
    },
    {
      question: "services.faq.inspectionQ",
      answer: "services.faq.inspectionA"
    }
  ];

  return (
    <ServiceLayout
      title={t("services.electrical.title")}
      description={t("services.electrical.description")}
      commonIssues={commonIssues}
      faqs={faqs}
    />
  );
};

export default Electrics;