import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SizeGuidePage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 bg-theme min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-serif text-4xl text-theme mb-6">Size Guide</h1>
          <div className="text-theme-tertiary space-y-4">
            <h2 className="text-theme font-medium">Women</h2>
            <table className="w-full border-collapse">
              <thead><tr className="border-b border-theme"><th className="py-2 text-left">Size</th><th className="py-2 text-left">Bust</th><th className="py-2 text-left">Waist</th><th className="py-2 text-left">Hip</th></tr></thead>
              <tbody>
                <tr className="border-b border-theme/20"><td className="py-2">S</td><td className="py-2">32-34"</td><td className="py-2">24-26"</td><td className="py-2">34-36"</td></tr>
                <tr className="border-b border-theme/20"><td className="py-2">M</td><td className="py-2">34-36"</td><td className="py-2">26-28"</td><td className="py-2">36-38"</td></tr>
                <tr className="border-b border-theme/20"><td className="py-2">L</td><td className="py-2">36-38"</td><td className="py-2">28-30"</td><td className="py-2">38-40"</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}