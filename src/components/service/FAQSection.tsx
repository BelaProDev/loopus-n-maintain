import { useTranslation } from "react-i18next";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

const FAQSection = ({ faqs }: FAQSectionProps) => {
  const { t } = useTranslation(["services"]);

  return (
    <div className="mt-12">
      <h2 className="text-2xl md:text-3xl font-serif text-[#2E5984] mb-6">
        {t("services:faq.title")}
      </h2>
      <div className="grid gap-6">
        {faqs.map((faq, index) => (
          <div key={index} className="glass-effect p-6 rounded-lg">
            <h3 className="font-semibold text-lg text-[#2E5984] mb-2">
              {t(`services:${faq.question}`)}
            </h3>
            <p className="text-gray-700">{t(`services:${faq.answer}`)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;