import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const InvoicingHeader = () => {
  const { t } = useTranslation(["tools"]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-4"
    >
      <h1 className="text-4xl font-bold">{t("invoicing.title")}</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        {t("invoicing.description")}
      </p>
    </motion.div>
  );
};

export default InvoicingHeader;