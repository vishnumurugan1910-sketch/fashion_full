import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 bg-theme min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-serif text-4xl text-theme mb-6">Terms of Service</h1>
          <div className="prose prose-invert text-theme-tertiary space-y-4">
            <p>By using this website, you agree to our terms and conditions.</p>
            <p>All orders are subject to availability and confirmation.</p>
            <p>We reserve the right to refuse service to anyone.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}