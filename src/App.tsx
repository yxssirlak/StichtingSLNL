import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import OverOns from './components/OverOns';
import Gemeenschap from './components/Gemeenschap';
import Activiteiten from './components/Activiteiten';
import Evenementen from './components/Evenementen';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Hier laden we de nieuwe uitgebreide homepagina in!
const HomePage = () => (
  <>
    <Home />
  </>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white font-sans">
        <Navbar />
        
        {/* Dit is de plek waar de pagina's wisselen als je op een link klikt */}
        <main className="flex-grow pt-20"> 
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/over-ons" element={<OverOns />} />
            <Route path="/gemeenschap" element={<Gemeenschap />} />
            <Route path="/activiteiten" element={<Activiteiten />} />
            <Route path="/evenementen" element={<Evenementen />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}