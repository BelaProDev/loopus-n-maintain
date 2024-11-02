import ServiceLayout from "./ServiceLayout";
import { useTranslation } from "react-i18next";

const Woodwork = () => {
  const { t } = useTranslation();

  const commonIssues = [
    { id: "repairs", label: t("services.woodworking.issues.repairs") },
    { id: "restoration", label: t("services.woodworking.issues.restoration") },
    { id: "customWork", label: t("services.woodworking.issues.customWork") },
    { id: "installation", label: t("services.woodworking.issues.installation") },
  ];

  const faqs = [
    {
      question: "services.faq.woodTypeQ",
      answer: "services.faq.woodTypeA"
    },
    {
      question: "services.faq.maintenanceQ",
      answer: "services.faq.maintenanceA"
    }
  ];

  return (
    <ServiceLayout
      title={t("services.woodworking.title")}
      description={t("services.woodworking.description")}
      commonIssues={commonIssues}
      faqs={faqs}
    />
  );
};

export default Woodwork;