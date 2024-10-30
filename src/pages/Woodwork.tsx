import ServiceHeader from "@/components/service/ServiceHeader";
import ServiceForm from "@/components/service/ServiceForm";

const Woodwork = () => {
  const commonIssues = [
    { id: "furniture-repair", label: "Furniture Repair" },
    { id: "cabinet-installation", label: "Cabinet Installation" },
    { id: "wood-rot", label: "Wood Rot Treatment" },
    { id: "custom-carpentry", label: "Custom Carpentry" },
  ];

  const faqs = [
    {
      question: "What types of wood do you work with?",
      answer: "We work with a wide variety of woods including oak, maple, pine, walnut, and exotic hardwoods. The choice depends on your specific needs and budget.",
    },
    {
      question: "How do I maintain wooden furniture?",
      answer: "Regular dusting, avoiding direct sunlight, and periodic polishing can help maintain wooden furniture. We recommend using appropriate wood cleaners and avoiding excess moisture.",
    },
  ];

  return (
    <div className="space-y-8">
      <ServiceHeader 
        title="Woodworking Services"
        description="Expert woodworking and carpentry services for your home or business. From custom furniture to repairs, we bring craftsmanship to every project."
      />
      <ServiceForm title="Woodworking Services" />
    </div>
  );
};

export default Woodwork;