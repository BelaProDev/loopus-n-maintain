import { Outlet } from 'react-router-dom';
import ServiceHeader from "@/components/service/ServiceHeader";
import ServiceForm from "@/components/service/ServiceForm";

const ServiceLayout = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Outlet />
    </div>
  );
};

export default ServiceLayout;