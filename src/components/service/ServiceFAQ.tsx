interface FAQProps {
  faqs: { question: string; answer: string }[];
}

export function ServiceFAQ({ faqs }: FAQProps) {
  return (
    <section aria-labelledby="faq-title" className="mt-12">
      <h2 id="faq-title" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
      <ul className="space-y-6">
        {faqs.map((faq, index) => (
          <li key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
            <p className="text-gray-600">{faq.answer}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}