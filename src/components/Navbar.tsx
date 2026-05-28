import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Over Ons', href: '#over-ons' },
  { label: 'Onze Gemeenschap', href: '#gemeenschap' },
  { label: 'Activiteiten', href: '#activiteiten' },
  { label: 'Evenementen', href: '#evenementen' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <a href="#home" onClick={() => handleNavClick('#home')} className="flex items-center gap-4 group">
            <img src="/SLNL_logo.png" alt="SLNL Logo" className="w-14 h-14 lg:w-16 lg:h-16 flex-shrink-0 group-hover:scale-105 transition-transform" />
            <div className="hidden md:block">
              <div className="font-black text-forest-800 text-base lg:text-lg leading-tight">STICHTING SLNL</div>
              <div className="text-xs text-gray-600 font-semibold leading-tight">Somaliland Nederland</div>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-forest-800 hover:bg-forest-50 rounded-lg transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Phone + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+31687950151"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-forest-800 transition-colors"
            >
              <Phone size={15} />
              <span>(+31) 6 87950151</span>
            </a>
            <button
              onClick={() => handleNavClick('#evenementen')}
              className="px-4 py-2 bg-forest-800 text-white text-sm font-semibold rounded-lg hover:bg-forest-700 active:scale-95 transition-all duration-200"
            >
              Doe Mee
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden border-t border-gray-100 bg-white overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:text-forest-800 hover:bg-forest-50 rounded-lg transition-all"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-gray-100 mt-3">
            <a href="tel:+31687950151" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-600">
              <Phone size={15} />
              <span>(+31) 6 87950151</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
