import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { faunaQueries } from "@/lib/fauna";
import ContentGrid from "./components/ContentGrid";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const ContentEditor = () => {
  const [storageType, setStorageType] = useState<"fauna" | "fallback">("fauna");
  const [key, setKey] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("en");
  const [type, setType] = useState<"text" | "textarea" | "wysiwyg">("text");
  const { toast } = useToast();
  const { t } = useTranslation(["common", "admin"]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await faunaQueries.updateContent({
        key,
        type,
        content,
        language,
        lastModified: Date.now(),
        modifiedBy: "admin"
      });
      
      toast({
        title: t("common:common.success"),
        description: t("admin:content.updateSuccess"),
      });
    } catch (error) {
      toast({
        title: t("common:common.error"),
        description: t("admin:content.updateError"),
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: any) => {
    setKey(item.key);
    setContent(item.content);
    setLanguage(item.language);
    setType(item.type);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">{t("admin:content.title")}</h2>
        <Select value={storageType} onValueChange={(value: "fauna" | "fallback") => setStorageType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("admin:content.selectStorage")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fauna">Fauna DB</SelectItem>
            <SelectItem value="fallback">Fallback JSON</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={storageType}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("admin:content.key")}</label>
                <Input
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder={t("admin:content.keyPlaceholder")}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t("admin:content.type")}</label>
                  <Select value={type} onValueChange={(value: "text" | "textarea" | "wysiwyg") => setType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("admin:content.selectType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">{t("admin:content.types.text")}</SelectItem>
                      <SelectItem value="textarea">{t("admin:content.types.textarea")}</SelectItem>
                      <SelectItem value="wysiwyg">{t("admin:content.types.wysiwyg")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{t("admin:content.language")}</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("admin:content.selectLanguage")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">{t("common:language.en")}</SelectItem>
                      <SelectItem value="fr">{t("common:language.fr")}</SelectItem>
                      <SelectItem value="es">{t("common:language.es")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t("admin:content.content")}</label>
                {type === "textarea" || type === "wysiwyg" ? (
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={t("admin:content.contentPlaceholder")}
                    required
                    rows={10}
                    className="min-h-[200px]"
                  />
                ) : (
                  <Input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={t("admin:content.contentPlaceholder")}
                    required
                  />
                )}
              </div>

              <Button type="submit">{t("common:common.save")}</Button>
            </form>
          </motion.div>
        </AnimatePresence>

        <ContentGrid 
          content={storageType === "fauna" ? [] : []} 
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
};

export default ContentEditor;