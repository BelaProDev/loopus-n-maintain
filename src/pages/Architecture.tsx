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
      question: "services:faq.designProcessQ",
      answer: "services:faq.designProcessA"
    },
    {
      question: "services:faq.timelineQ",
      answer: "services:faq.timelineA"
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