import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactQueries } from "@/lib/fauna/contactQueries";
import { useToast } from "@/components/ui/use-toast";
import { ContactMessage } from "@/lib/fauna/types";

interface ServiceFormProps {
  service: ContactMessage['service'];
}

const ServiceForm = ({ service }: ServiceFormProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const messageData = {
      service,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    try {
      await contactQueries.createMessage(messageData);
      toast({
        title: t('common:common.success'),
        description: t('common:form.submitSuccess'),
      });
      e.currentTarget.reset();
    } catch (error) {
      toast({
        title: t('common:common.error'),
        description: t('common:form.submitError'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        placeholder={t('common:form.namePlaceholder')}
        required
      />
      <Input
        name="email"
        type="email"
        placeholder={t('common:form.emailPlaceholder')}
        required
      />
      <Textarea
        name="message"
        placeholder={t('common:form.messagePlaceholder')}
        required
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('common:common.submitting') : t('common:common.submit')}
      </Button>
    </form>
  );
};

export default ServiceForm;