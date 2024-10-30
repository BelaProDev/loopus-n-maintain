import ServiceHeader from "@/components/service/ServiceHeader";
import ServiceForm from "@/components/service/ServiceForm";

const Electrics = () => {
  const commonIssues = [
    { id: "power-outage", label: "Power Outage" },
    { id: "circuit-breaker", label: "Circuit Breaker Issues" },
    { id: "flickering-lights", label: "Flickering Lights" },
    { id: "outlet-not-working", label: "Outlet Not Working" },
  ];

  const faqs = [
    {
      question: "What should I do during a power outage?",
      answer: "First, check if your neighbors have power. If they do, check your circuit breaker. If not, contact your utility company.",
    },
    {
      question: "How often should electrical systems be inspected?",
      answer: "Professional electrical inspections should be conducted every 3-5 years, or when purchasing a new property.",
    },
  ];

  return (
    <div className="space-y-8">
      <ServiceHeader 
        title="Electrical Services"
        description="Professional electrical maintenance and repair services for your home or business. Our certified electricians ensure safe and reliable electrical systems."
      />
      <ServiceForm title="Electrical Services" />
    </div>
  );
};

export default Electrics;