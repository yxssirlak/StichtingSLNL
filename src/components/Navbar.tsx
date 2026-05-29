import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Over Ons', href: '/over-ons' },
  { label: 'Onze Gemeenschap', href: '/gemeenschap' },
  { label: 'Activiteiten', href: '/activiteiten' },
  { label: 'Evenementen', href: '/evenementen' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      {/* max-w-[1600px] zorgt ervoor dat hij veel meer van je scherm gebruikt, w-full zorgt voor de breedte */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          
          {/* LINKERKANT: Logo (flex-1 zorgt dat deze sectie even groot is als de rechterkant) */}
          <div className="flex-1 flex justify-start z-20">
            <Link to="/" className="flex items-center gap-4 group">
              <img src="/SLNL_logo.png" alt="SLNL Logo" className="w-14 h-14 lg:w-16 lg:h-16 flex-shrink-0 group-hover:scale-105 transition-transform" />
              <div className="hidden md:block">
                <div className="font-black text-forest-800 text-base lg:text-lg leading-tight">STICHTING SLNL</div>
                <div className="text-xs text-gray-600 font-semibold leading-tight">Somaliland Nederland</div>
              </div>
            </Link>
          </div>

          {/* MIDDEN: Nav links (Ademt meer door xl:gap-4 en px-4) */}
          <nav className="hidden lg:flex flex-shrink-0 items-center justify-center gap-2 xl:gap-4 z-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative px-4 py-2.5 rounded-xl font-semibold transition-colors duration-300 group ${
                  location.pathname === link.href ? 'text-forest-800' : 'text-gray-600 hover:text-forest-800'
                }`}
              >
                {/* De tekst van de link */}
                <span className="relative z-10 whitespace-nowrap">{link.label}</span>
                
                {/* Het coole hover effect */}
                <span 
                  className={`absolute inset-0 bg-forest-50 rounded-xl transition-all duration-300 ease-out origin-center ${
                    location.pathname === link.href 
                      ? 'scale-100 opacity-100' 
                      : 'scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100'
                  }`} 
                />
              </Link>
            ))}
          </nav>

          {/* RECHTERKANT: Telefoon + Knop (flex-1 balanceert de linkerkant uit) */}
          <div className="flex-1 hidden lg:flex items-center justify-end gap-6 z-20">
            <a
              href="tel:+31611226129"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-forest-800 transition-colors whitespace-nowrap"
            >
              <Phone size={15} />
              <span>+31 6 11226129</span>
            </a>
            <Link
              to="/evenementen"
              className="px-6 py-2.5 bg-forest-800 text-white text-sm font-semibold rounded-xl hover:bg-forest-700 active:scale-95 transition-all duration-200 shadow-md shadow-forest-800/20 whitespace-nowrap"
            >
              Doe Mee
            </Link>
          </div>

          {/* Mobiel Menu Knop (Wordt alleen getoond op kleine schermen) */}
          <div className="flex-1 flex justify-end lg:hidden z-20">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu dropdown */}
      <div
        className={`lg:hidden border-t border-gray-100 bg-white overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 space-y-1 shadow-inner">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`block w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                location.pathname === link.href ? 'text-forest-800 bg-forest-50' : 'text-gray-600 hover:text-forest-800 hover:bg-forest-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 mt-3">
            <a href="tel:+31611226129" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600">
              <Phone size={15} />
              <span>+31 6 11226129</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}