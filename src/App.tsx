import Navbar from './components/Navbar';
import Hero from './components/Hero';
import OverOns from './components/OverOns';
import Gemeenschap from './components/Gemeenschap';
import Activiteiten from './components/Activiteiten';
import Evenementen from './components/Evenementen';
import CallToAction from './components/CallToAction';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <main>
        <Hero />
        <OverOns />
        <Gemeenschap />
        <Activiteiten />
        <Evenementen />
        <CallToAction />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
