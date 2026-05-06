import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import HorizontalScrollExperience from '@/components/HorizontalScrollExperience';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <HorizontalScrollExperience />
      <Footer />
    </main>
  );
}
