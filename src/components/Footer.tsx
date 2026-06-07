import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-forest-50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Kolom 1: Logo & Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/SLNL_logo.png" alt="SLNL Logo" className="w-12 h-12 bg-white rounded-full p-1" />
              <div>
                <div className="font-black text-white text-lg leading-tight">Stichting SLNL</div>
                <div className="text-xs text-forest-200 font-semibold">Somaliland Nederland</div>
              </div>
            </div>
            <p className="text-sm text-forest-200 leading-relaxed max-w-sm">
              Stichting SLNL versterkt de Somalilandse gemeenschap in Nederland en bouwt bruggen voor de internationale erkenning van Somaliland.
            </p>
          </div>

          {/* Kolom 2: Snelle Links */}
          <div>
            <h3 className="text-white font-bold tracking-wider text-sm mb-6 uppercase">Snelle Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-forest-200 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link to="/over-ons" className="text-forest-200 hover:text-white transition-colors text-sm">Over Ons</Link></li>
              <li><Link to="/evenementen" className="text-forest-200 hover:text-white transition-colors text-sm">Evenementen</Link></li>
              <li><Link to="/contact" className="text-forest-200 hover:text-white transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Informatie & KvK */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-white font-bold tracking-wider text-sm mb-6 uppercase">Informatie</h3>
              <ul className="space-y-3">
                <li className="text-sm">
                  <a href="/Algemene_Voorwaarden_Stichting_SLNL.pdf" target="_blank" rel="noopener noreferrer" className="text-forest-200 hover:text-white transition-colors">
                    Algemene Voorwaarden
                  </a>
                </li>
                <li className="text-sm">
                  <a href="/Privacybeleid_Stichting_SLNL.pdf" target="_blank" rel="noopener noreferrer" className="text-forest-200 hover:text-white transition-colors">
                    Privacybeleid
                  </a>
                </li>
              </ul>
            </div>
            {/* KvK nummer strak onderaan de kolom */}
            <div className="mt-8 text-sm text-forest-400 font-medium">
              <p>KvK-nummer: 59399686</p>
            </div>
          </div>
        </div>

        {/* Onderste balk met Copyright én de verborgen Admin knop */}
        <div className="pt-8 border-t border-forest-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-forest-400">
            &copy; {new Date().getFullYear()} Stichting SLNL. Alle rechten voorbehouden.
          </p>
          
          <Link 
            to="/admin" 
            className="flex items-center gap-2 text-sm text-forest-400 hover:text-white transition-colors group"
          >
            <Lock size={14} className="group-hover:scale-110 transition-transform" />
            <span>Bestuur Login</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}