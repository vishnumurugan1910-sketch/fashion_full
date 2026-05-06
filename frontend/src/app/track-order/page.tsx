import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TrackOrderPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 bg-theme min-h-screen">
        <div className="max-w-md mx-auto px-6">
          <h1 className="font-serif text-4xl text-theme mb-6 text-center">Track Order</h1>
          <p className="text-theme-tertiary mb-6 text-center">Enter your order number to track your shipment.</p>
          <input
            type="text"
            placeholder="Order Number"
            className="w-full px-4 py-3 bg-theme-input border border-theme-strong rounded text-theme placeholder:text-theme-muted mb-4"
          />
          <button className="w-full py-3 bg-gold text-black font-medium rounded hover:bg-gold/90">Track</button>
        </div>
      </main>
      <Footer />
    </>
  );
}