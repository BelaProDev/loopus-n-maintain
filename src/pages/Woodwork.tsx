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
      question: "faq.woodTypeQ",
      answer: "faq.woodTypeA"
    },
    {
      question: "faq.maintenanceQ",
      answer: "faq.maintenanceA"
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