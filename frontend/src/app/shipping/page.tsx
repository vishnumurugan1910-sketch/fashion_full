import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ShippingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 bg-theme min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-serif text-4xl text-theme mb-6">Shipping & Returns</h1>
          <div className="prose prose-invert text-theme-tertiary space-y-4">
            <h2 className="text-theme font-medium mt-6">Shipping</h2>
            <p>We offer free shipping on orders above ₹15,000. Standard delivery takes 5-7 business days.</p>
            <h2 className="text-theme font-medium mt-6">Returns</h2>
            <p>Easy returns within 30 days of delivery. Items must be unworn with tags attached.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}