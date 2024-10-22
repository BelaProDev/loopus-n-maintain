import ServiceLayout from "./ServiceLayout";

const Ironwork = () => {
  const commonIssues = [
    { id: "rust", label: "Rust and Corrosion" },
    { id: "structural-damage", label: "Structural Damage" },
    { id: "welding-repairs", label: "Welding Repairs" },
    { id: "gate-fence-issues", label: "Gate and Fence Issues" },
  ];

  const faqs = [
    {
      question: "How can I prevent rust on my iron structures?",
      answer: "Regular cleaning, painting, and applying rust-resistant coatings can help prevent rust on iron structures.",
    },
    {
      question: "What types of ironwork services do you offer?",
      answer: "We offer a wide range of services including custom fabrication, structural repairs, ornamental ironwork, and welding services.",
    },
  ];

  return (
    <ServiceLayout
      title="Ironwork Services"
      description="Professional ironwork services for both functional and decorative needs. Our skilled craftsmen bring strength and beauty to your metal structures."
      commonIssues={commonIssues}
      faqs={faqs}
    />
  );
};

export default Ironwork;