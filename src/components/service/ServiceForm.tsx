import { useState } from "react";
import { useTranslation } from "react-i18next";
import ValidatedInput from "@/components/form/ValidatedInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { contactQueries } from "@/lib/fauna/contactQueries";
import { useToast } from "@/components/ui/use-toast";
import { ContactMessage } from "@/lib/fauna/types";

interface ServiceFormProps {
  service: ContactMessage['service'];
}

const ServiceForm = ({ service }: ServiceFormProps) => {
  const { t } = useTranslation(['common', 'services']);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contactQueries.createMessage({
        service,
        ...formData
      });

      toast({
        title: t('common:status.success'),
        description: t('common:form.submitSuccess'),
      });

      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast({
        title: t('common:status.error'),
        description: t('common:form.submitError'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 glass-effect">
      <h2 className="text-2xl font-serif text-[#2E5984] mb-6">
        {t(`services:${service}.title`)}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ValidatedInput
          id="name"
          name="name"
          label={t('common:form.namePlaceholder')}
          value={formData.name}
          onChange={handleChange}
          required
        />
        <ValidatedInput
          id="email"
          name="email"
          type="email"
          label={t('common:form.emailPlaceholder')}
          value={formData.email}
          onChange={handleChange}
          required
        />
        <ValidatedInput
          id="message"
          name="message"
          label={t('common:form.messagePlaceholder')}
          value={formData.message}
          onChange={handleChange}
          required
          isTextarea
          maxLength={500}
        />
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? t('common:status.submitting') : t('common:status.submit')}
        </Button>
      </form>
    </Card>
  );
};

export default ServiceForm;