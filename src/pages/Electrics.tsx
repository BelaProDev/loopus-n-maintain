import ServiceLayout from "./ServiceLayout";
import { useTranslation } from "react-i18next";

const Electrics = () => {
  const { t } = useTranslation();

  const commonIssues = [
    { id: "power-outage", label: t("services.electrical.issues.powerOutage") },
    { id: "circuit-breaker", label: t("services.electrical.issues.circuitBreaker") },
    { id: "flickering-lights", label: t("services.electrical.issues.flickeringLights") },
    { id: "outlet-not-working", label: t("services.electrical.issues.outletNotWorking") },
  ];

  const faqs = [
    {
      question: t("services.faq.powerOutageQ"),
      answer: t("services.faq.powerOutageA"),
    },
    {
      question: t("services.faq.inspectionQ"),
      answer: t("services.faq.inspectionA"),
    },
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