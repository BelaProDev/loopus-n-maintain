import ServiceLayout from "./ServiceLayout";
import { useTranslation } from "react-i18next";

const Woodwork = () => {
  const { t } = useTranslation(["services"]);

  const commonIssues = [
    { id: "repairs", label: t("services:woodworking.issues.repairs") },
    { id: "restoration", label: t("services:woodworking.issues.restoration") },
    { id: "customWork", label: t("services:woodworking.issues.customWork") },
    { id: "installation", label: t("services:woodworking.issues.installation") },
  ];

  const faqs = [
    {
      question: "faq.woodworking.maintenanceQ",
      answer: "faq.woodworking.maintenanceA"
    },
    {
      question: "faq.woodworking.customQ",
      answer: "faq.woodworking.customA"
    },
    {
      question: "faq.woodworking.repairQ",
      answer: "faq.woodworking.repairA"
    }
  ];

  return (
    <ServiceLayout
      title={t("services:woodworking.title")}
      description={t("services:woodworking.description")}
      commonIssues={commonIssues}
      faqs={faqs}
    />
  );
};

export default Woodwork;