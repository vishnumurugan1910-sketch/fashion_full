import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function OurStory() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 bg-theme min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-serif text-4xl text-theme mb-6">Our Story</h1>
          <div className="prose prose-invert">
            <p className="text-theme-tertiary mb-4">
              Founded with a vision to redefine luxury fashion, ÉLÉVATION represents the pinnacle of craftsmanship and timeless design. 
              Our journey began with a simple belief: that exceptional quality and elegant design should go hand in hand.
            </p>
            <p className="text-theme-tertiary mb-4">
              Each piece in our collection is thoughtfully curated from the world's finest ateliers, 
              ensuring that every garment meets our exacting standards of excellence.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}