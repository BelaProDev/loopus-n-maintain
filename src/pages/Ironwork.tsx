import ServiceLayout from "./ServiceLayout";
import { useTranslation } from "react-i18next";

const Ironwork = () => {
  const { t } = useTranslation(["services"]);

  const commonIssues = [
    { id: "rust", label: t("services:ironwork.issues.rust") },
    { id: "structuralDamage", label: t("services:ironwork.issues.structuralDamage") },
    { id: "weldingRepairs", label: t("services:ironwork.issues.weldingRepairs") },
    { id: "gateFenceIssues", label: t("services:ironwork.issues.gateFenceIssues") },
  ];

  const faqs = [
    {
      question: "faq.ironwork.rustQ",
      answer: "faq.ironwork.rustA"
    },
    {
      question: "faq.ironwork.customQ",
      answer: "faq.ironwork.customA"
    },
    {
      question: "faq.ironwork.strengthQ",
      answer: "faq.ironwork.strengthA"
    }
  ];

  return (
    <ServiceLayout
      title={t("services:ironwork.title")}
      description={t("services:ironwork.description")}
      commonIssues={commonIssues}
      faqs={faqs}
    />
  );
};

export default Ironwork;