import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { settingsQueries } from "@/lib/mongodb/settingsQueries";
import ServiceHeader from "@/components/service/ServiceHeader";
import ServiceForm from "@/components/service/ServiceForm";

const ServiceLayout = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  
  const { data: service, isLoading } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => settingsQueries.getServiceById(serviceId),
    enabled: !!serviceId,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <ServiceHeader service={service} />
      <ServiceForm service={service} />
    </div>
  );
};

export default ServiceLayout;
