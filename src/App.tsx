import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import OverOns from './components/OverOns';
import Gemeenschap from './components/Gemeenschap';
import Activiteiten from './components/Activiteiten';
import Evenementen from './components/Evenementen';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './components/Admin';
import Gallerij from './components/Gallerij'; // <-- 1. Importeer je nieuwe galerij component

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
        
        <main className="flex-grow pt-20"> 
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/over-ons" element={<OverOns />} />
            <Route path="/gemeenschap" element={<Gemeenschap />} />
            <Route path="/activiteiten" element={<Activiteiten />} />
            <Route path="/evenementen" element={<Evenementen />} />
            <Route path="/galerij" element={<Gallerij />} /> {/* <-- 2. Voeg de route toe */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}