import ServiceLayout from "./ServiceLayout";

const Electrics = () => {
  const commonIssues = [
    { id: "power-outage", label: "services.electrical.issues.powerOutage" },
    { id: "circuit-breaker", label: "services.electrical.issues.circuitBreaker" },
    { id: "flickering-lights", label: "services.electrical.issues.flickeringLights" },
    { id: "outlet-not-working", label: "services.electrical.issues.outletNotWorking" },
  ];

  const faqs = [
    {
      question: "services.faq.powerOutageQ",
      answer: "services.faq.powerOutageA",
    },
    {
      question: "services.faq.inspectionQ",
      answer: "services.faq.inspectionA",
    },
  ];

  return (
    <ServiceLayout
      title="services.electrical.title"
      description="services.electrical.description"
      commonIssues={commonIssues}
      faqs={faqs}
    />
  );
};

export default Electrics;