import ServiceLayout from "./ServiceLayout";
import { useTranslation } from "react-i18next";

const Woodwork = () => {
  const { t } = useTranslation(["services"]);

  const commonIssues = [
    { id: "repairs", label: t("services:woodwork.issues.repairs") },
    { id: "restoration", label: t("services:woodwork.issues.restoration") },
    { id: "customWork", label: t("services:woodwork.issues.customWork") },
    { id: "installation", label: t("services:woodwork.issues.installation") },
  ];

  const faqs = [
    {
      question: "services:faq.woodwork.materialsQ",
      answer: "services:faq.woodwork.materialsA"
    },
    {
      question: "services:faq.woodwork.finishingQ",
      answer: "services:faq.woodwork.finishingA"
    },
    {
      question: "services:faq.woodwork.customQ",
      answer: "services:faq.woodwork.customA"
    }
  ];

  return (
    <ServiceLayout
      title={t("services:woodwork.title")}
      description={t("services:woodwork.description")}
      commonIssues={commonIssues}
      faqs={faqs}
    />
  );
};

export default Woodwork;