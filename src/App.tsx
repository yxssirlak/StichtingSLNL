import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import OverOns from './components/OverOns';
import Gemeenschap from './components/Gemeenschap';
import Evenementen from './components/Evenementen';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './components/Admin';
import Gallerij from './components/Gallerij';
import Succes from './components/Succes';
import Scanner from './components/Scanner';

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
            <Route path="/evenementen" element={<Evenementen />} />
            <Route path="/galerij" element={<Gallerij />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/succes" element={<Succes />} />
            <Route path="/scanner" element={<Scanner />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}