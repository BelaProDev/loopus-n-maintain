import ServiceLayout from "./ServiceLayout";

const Architecture = () => {
  const commonIssues = [
    { id: "design-consultation", label: "Design Consultation" },
    { id: "permit-assistance", label: "Building Permit Assistance" },
    { id: "renovation-planning", label: "Renovation Planning" },
    { id: "structural-assessment", label: "Structural Assessment" },
  ];

  const faqs = [
    {
      question: "What's involved in the design process?",
      answer: "Our design process includes initial consultation, concept development, detailed drawings, and final plans. We work closely with clients to ensure their vision is realized.",
    },
    {
      question: "How long does the design phase typically take?",
      answer: "The design phase can take anywhere from 2-8 weeks depending on the project scope and complexity. We'll provide a detailed timeline during our initial consultation.",
    },
  ];

  return (
    <ServiceLayout
      title="Architectural Services"
      description="Professional architectural design, planning and other services. We help bring your vision to life with expert guidance through every phase of your project."
      commonIssues={commonIssues}
      faqs={faqs}
    />
  );
};

export default Architecture;