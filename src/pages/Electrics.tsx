import ServiceLayout from "./ServiceLayout";

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
    <ServiceLayout
      title="Electrical Services"
      description="Professional electrical maintenance and repair services for your home or business. Our certified electricians ensure safe and reliable electrical systems."
      commonIssues={commonIssues}
      faqs={faqs}
    />
  );
};

export default Electrics;