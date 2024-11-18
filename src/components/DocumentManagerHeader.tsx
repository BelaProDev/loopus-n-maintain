import { useTranslation } from "react-i18next";

const DocumentManagerHeader = () => {
  const { t } = useTranslation(["ui"]);

  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold">
        {t("ui:documentManager.title")}
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        {t("ui:documentManager.description")}
      </p>
    </div>
  );
};

export default DocumentManagerHeader;