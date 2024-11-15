import ServiceLayout from "./ServiceLayout";
import { useTranslation } from "react-i18next";

const Plumbing = () => {
  const { t } = useTranslation(["services"]);

  const commonIssues = [
    { id: "leaks", label: t("services:plumbing.issues.leaks") },
    { id: "clogs", label: t("services:plumbing.issues.clogs") },
    { id: "lowPressure", label: t("services:plumbing.issues.lowPressure") },
    { id: "waterHeater", label: t("services:plumbing.issues.waterHeater") },
  ];

  const faqs = [
    {
      question: "services:faq.plumbing.preventionQ",
      answer: "services:faq.plumbing.preventionA"
    },
    {
      question: "services:faq.plumbing.winterQ",
      answer: "services:faq.plumbing.winterA"
    },
    {
      question: "services:faq.plumbing.waterBillQ",
      answer: "services:faq.plumbing.waterBillA"
    }
  ];

  return (
    <ServiceLayout
      title={t("services:plumbing.title")}
      description={t("services:plumbing.description")}
      commonIssues={commonIssues}
      faqs={faqs}
    />
  );
};

export default Plumbing;