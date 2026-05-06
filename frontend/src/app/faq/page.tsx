import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const faqs = [
  { q: "How do I track my order?", a: "Use your order number on the Track Order page." },
  { q: "What is your return policy?", a: "We accept returns within 30 days." },
  { q: "Do you ship internationally?", a: "Yes, we ship to select countries." },
];

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 bg-theme min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-serif text-4xl text-theme mb-6">FAQs</h1>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="text-theme font-medium mb-2">{faq.q}</h3>
                <p className="text-theme-tertiary">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}