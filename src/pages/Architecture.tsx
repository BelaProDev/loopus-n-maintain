import ServiceLayout from "./ServiceLayout";
import { useTranslation } from "react-i18next";

const Architecture = () => {
  const { t } = useTranslation(["services"]);

  const commonIssues = [
    { id: "designConsultation", label: t("services:architecture.issues.designConsultation") },
    { id: "permitAssistance", label: t("services:architecture.issues.permitAssistance") },
    { id: "renovationPlanning", label: t("services:architecture.issues.renovationPlanning") },
    { id: "structuralAssessment", label: t("services:architecture.issues.structuralAssessment") },
  ];

  const faqs = [
    {
      question: "services:faq.architecture.processQ",
      answer: "services:faq.architecture.processA"
    },
    {
      question: "services:faq.architecture.timelineQ",
      answer: "services:faq.architecture.timelineA"
    },
    {
      question: "services:faq.architecture.sustainableQ",
      answer: "services:faq.architecture.sustainableA"
    }
  ];

  return (
    <ServiceLayout
      title={t("services:architecture.title")}
      description={t("services:architecture.description")}
      commonIssues={commonIssues}
      faqs={faqs}
    />
  );
};

export default Architecture;