import ServiceHeader from "@/components/service/ServiceHeader";
import ServiceForm from "@/components/service/ServiceForm";

interface ServiceLayoutProps {
  title: string;
  description: string;
  commonIssues: Array<{ id: string; label: string }>;
  faqs: Array<{ question: string; answer: string }>;
}

const ServiceLayout = ({ title, description }: ServiceLayoutProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ServiceHeader title={title} description={description} />
      <ServiceForm title={title} />
    </div>
  );
};

export default ServiceLayout;