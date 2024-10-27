import ServiceLayout from "./ServiceLayout";
import { useTranslation } from "react-i18next";

const Electrics = () => {
  const { t } = useTranslation();

  const commonIssues = [
    { id: "power-outage", label: t('power_outage') },
    { id: "circuit-breaker", label: t('circuit_breaker') },
    { id: "flickering-lights", label: t('flickering_lights') },
    { id: "outlet-not-working", label: t('outlet_not_working') },
  ];

  const faqs = [
    {
      question: t('what_to_do_power_outage'),
      answer: t('power_outage_answer'),
    },
    {
      question: t('how_often_inspection'),
      answer: t('inspection_answer'),
    },
  ];

  return (
    <ServiceLayout
      title={t('electrical_services')}
      description={t('electrical_description')}
      commonIssues={commonIssues}
      faqs={faqs}
    />
  );
};

export default Electrics;