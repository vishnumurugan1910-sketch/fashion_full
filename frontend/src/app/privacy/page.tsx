import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 bg-theme min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-serif text-4xl text-theme mb-6">Privacy Policy</h1>
          <div className="prose prose-invert text-theme-tertiary space-y-4">
            <p>Your privacy is important to us. This policy explains how we collect, use, and protect your information.</p>
            <p>We collect information you provide when using our website, including for orders and account creation.</p>
            <p>Your data is securely stored and never sold to third parties.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}