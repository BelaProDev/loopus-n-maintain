import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { settingsQueries } from "@/lib/mongodb/settingsQueries";
import ServiceHeader from "@/components/service/ServiceHeader";
import ServiceForm from "@/components/service/ServiceForm";

interface ServiceLayoutProps {
  title: string;
  description: string;
  commonIssues: Array<{ id: string; label: string }>;
  faqs: Array<{ question: string; answer: string }>;
}

const ServiceLayout = ({ title, description, commonIssues, faqs }: ServiceLayoutProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ServiceHeader title={title} description={description} />
      <ServiceForm 
        commonIssues={commonIssues}
        faqs={faqs}
      />
    </div>
  );
};

export default ServiceLayout;