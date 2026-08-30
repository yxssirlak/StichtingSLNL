import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Lock, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Over Ons', href: '/over-ons' },
  { label: 'Onze Gemeenschap', href: '/gemeenschap' },
  { label: 'Evenementen', href: '/evenementen' },
  { label: 'Galerij', href: '/galerij' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);

  // --- NIEUW: Bulletproof Google Translate Logica via Cookies (Blijft onthouden!) ---
  const getActiveLanguage = () => {
    const match = document.cookie.match(/googtrans=\/nl\/([a-z]{2})/);
    return match ? match[1].toUpperCase() : 'NL';
  };

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [huidigeTaal] = useState(getActiveLanguage());

  const veranderTaal = (taalcode: string) => {
    const host = window.location.hostname;
    
    if (taalcode === 'nl') {
      // Gooi de cookie op letterlijk elke mogelijke manier weg
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${host}; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${host}; path=/;`;
      
      // Maak ook de browser cache schoon voor de zekerheid
      window.localStorage.removeItem('googtrans');
      window.sessionStorage.removeItem('googtrans');
    } else {
      // Stel de cookie in voor een jaar
      const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `googtrans=/nl/${taalcode}; expires=${expires}; path=/;`;
      document.cookie = `googtrans=/nl/${taalcode}; expires=${expires}; domain=${host}; path=/;`;
      document.cookie = `googtrans=/nl/${taalcode}; expires=${expires}; domain=.${host}; path=/;`;
    }
    
    // Herlaad de pagina
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          
          {/* LINKERKANT: Logo */}
          <div className="flex-1 flex justify-start z-20">
            <Link to="/" className="flex items-center gap-4 group">
              <img src="/SLNL_logo.png" alt="SLNL Logo" className="w-14 h-14 lg:w-16 lg:h-16 flex-shrink-0 group-hover:scale-105 transition-transform" />
              <div className="hidden md:block">
                <div className="font-black text-forest-800 text-base lg:text-lg leading-tight">STICHTING SLNL</div>
                <div className="text-xs text-gray-600 font-semibold leading-tight">Somaliland Nederland</div>
              </div>
            </Link>
          </div>

          {/* MIDDEN: Nav links */}
          <nav className="hidden lg:flex flex-shrink-0 items-center justify-center gap-1 xl:gap-3 z-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative px-3 xl:px-4 py-2.5 rounded-xl font-semibold transition-colors duration-300 group ${
                  location.pathname === link.href ? 'text-forest-800' : 'text-gray-600 hover:text-forest-800'
                }`}
              >
                <span className="relative z-10 whitespace-nowrap">{link.label}</span>
                <span 
                  className={`absolute inset-0 bg-forest-50 rounded-xl transition-all duration-300 ease-out origin-center ${
                    location.pathname === link.href 
                      ? 'scale-100 opacity-100' 
                      : 'scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100'
                  }`} 
                />
              </Link>
            ))}

            {session && (
              <Link
                to="/admin"
                className={`relative px-3 xl:px-4 py-2.5 rounded-xl font-bold transition-colors duration-300 group ${
                  location.pathname === '/admin' ? 'text-forest-800' : 'text-forest-600 hover:text-forest-800'
                }`}
              >
                <span className="relative z-10 whitespace-nowrap flex items-center gap-1.5">
                  <Lock size={14} /> Admin
                </span>
                <span 
                  className={`absolute inset-0 bg-forest-50 rounded-xl transition-all duration-300 ease-out origin-center ${
                    location.pathname === '/admin' 
                      ? 'scale-100 opacity-100' 
                      : 'scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100'
                  }`} 
                />
              </Link>
            )}
          </nav>

          {/* RECHTERKANT: Custom Taal Knop & Doe Mee */}
          <div className="flex-1 hidden lg:flex items-center justify-end gap-4 xl:gap-6 z-20">
            
            {/* JOUW EIGEN MOOIE TAAL DROPDOWN (met notranslate) */}
            <div className="relative notranslate" translate="no">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-600 hover:text-forest-800 hover:bg-forest-50 transition-colors font-bold text-sm cursor-pointer"
              >
                <Globe size={18} />
                {huidigeTaal}
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden z-50">
                  <div className="flex flex-col py-1">
                    <button onClick={() => veranderTaal('nl')} className={`px-4 py-2 text-left text-sm font-bold hover:bg-forest-50 transition-colors ${huidigeTaal === 'NL' ? 'text-forest-800' : 'text-gray-600'}`}>Nederlands</button>
                    <button onClick={() => veranderTaal('en')} className={`px-4 py-2 text-left text-sm font-bold hover:bg-forest-50 transition-colors ${huidigeTaal === 'EN' ? 'text-forest-800' : 'text-gray-600'}`}>English</button>
                    <button onClick={() => veranderTaal('so')} className={`px-4 py-2 text-left text-sm font-bold hover:bg-forest-50 transition-colors ${huidigeTaal === 'SO' ? 'text-forest-800' : 'text-gray-600'}`}>Soomaali</button>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/evenementen"
              className="px-6 py-2.5 bg-forest-800 text-white text-sm font-semibold rounded-xl hover:bg-forest-700 active:scale-95 transition-all duration-200 shadow-md shadow-forest-800/20 whitespace-nowrap"
            >
              Doe Mee
            </Link>
          </div>

          {/* Mobiel Menu Knop */}
          <div className="flex-1 flex justify-end lg:hidden z-20">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu dropdown */}
      <div className={`lg:hidden border-t border-gray-100 bg-white overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
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
          
          {session && (
            <Link
              to="/admin"
              className={`block w-full text-left px-4 py-3 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                location.pathname === '/admin' ? 'text-forest-800 bg-forest-50' : 'text-gray-600 hover:text-forest-800 hover:bg-forest-50'
              }`}
            >
              <Lock size={16} /> Admin Dashboard
            </Link>
          )}

          {/* JOUW EIGEN MOOIE TAALKNOPPEN OP MOBIEL (met notranslate) */}
          <div className="notranslate flex justify-around items-center pt-4 mt-2 border-t border-gray-100" translate="no">
            <button onClick={() => veranderTaal('nl')} className={`px-4 py-2 rounded-xl text-sm font-bold ${huidigeTaal === 'NL' ? 'bg-forest-50 text-forest-800' : 'text-gray-500'}`}>NL</button>
            <button onClick={() => veranderTaal('en')} className={`px-4 py-2 rounded-xl text-sm font-bold ${huidigeTaal === 'EN' ? 'bg-forest-50 text-forest-800' : 'text-gray-500'}`}>EN</button>
            <button onClick={() => veranderTaal('so')} className={`px-4 py-2 rounded-xl text-sm font-bold ${huidigeTaal === 'SO' ? 'bg-forest-50 text-forest-800' : 'text-gray-500'}`}>SO</button>
          </div>

        </div>
      </div>
    </header>
  );
}