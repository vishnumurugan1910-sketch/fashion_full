import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 bg-theme min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-serif text-4xl text-theme mb-6">Contact Us</h1>
          <div className="text-theme-tertiary">
            <p className="mb-4">We're here to help. Reach out to us at:</p>
            <p className="mb-2">Email: contact@elevation.com</p>
            <p>Phone: +91 98765 43210</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}