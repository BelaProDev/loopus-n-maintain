import ServiceHeader from "@/components/service/ServiceHeader";
import ServiceForm from "@/components/service/ServiceForm";

const Plumbing = () => {
  const commonIssues = [
    { id: "leaky-pipes", label: "Leaky Pipes" },
    { id: "clogged-drain", label: "Clogged Drain" },
    { id: "low-water-pressure", label: "Low Water Pressure" },
    { id: "water-heater-issues", label: "Water Heater Issues" },
  ];

  const faqs = [
    {
      question: "How often should I have my plumbing inspected?",
      answer: "It's recommended to have a professional plumbing inspection every 2 years to catch potential issues early.",
    },
    {
      question: "What should I do if I have a major water leak?",
      answer: "Immediately shut off the main water valve to your home and call a professional plumber for emergency service.",
    },
  ];

  return (
    <div className="space-y-8">
      <ServiceHeader 
        title="Plumbing Services"
        description="Expert plumbing solutions for your home or business. Our skilled plumbers handle everything from minor repairs to major installations."
      />
      <ServiceForm title="Plumbing Services" />
    </div>
  );
};

export default Plumbing;