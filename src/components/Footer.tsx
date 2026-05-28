import { Phone, Mail, ExternalLink } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Over Ons', href: '#over-ons' },
  { label: 'Onze Gemeenschap', href: '#gemeenschap' },
  { label: 'Activiteiten', href: '#activiteiten' },
  { label: 'Evenementen', href: '#evenementen' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-forest-950">
      {/* Landscape texture overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg"
          alt=""
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/90 via-forest-950/95 to-forest-950" />
      </div>

      {/* Top accent line — Somaliland flag colors */}
      <div className="relative h-1 flex">
        <div className="flex-1 bg-forest-600" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-somali-red" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/SLNL_logo.png" alt="SLNL Logo" className="w-12 h-12 flex-shrink-0" />
              <div>
                <div className="font-bold text-white">Stichting SLNL</div>
                <div className="text-xs text-white/50">Somaliland Nederland</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-5">
              Stichting SLNL versterkt de Somalilandse gemeenschap in Nederland en bouwt bruggen
              voor de internationale erkenning van Somaliland. Opgericht in 2012.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="tel:+31687950151"
                className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <Phone size={14} />
                <span>(+31) 6 87950151</span>
              </a>
              <a
                href="mailto:info@slnl.nl"
                className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <Mail size={14} />
                <span>info@slnl.nl</span>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Snelle Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-sm text-white/60 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Info */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Informatie
            </h4>
            <ul className="space-y-2 mb-5">
              <li>
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors inline-flex items-center gap-1">
                  Privacybeleid <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors inline-flex items-center gap-1">
                  Algemene Voorwaarden <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors inline-flex items-center gap-1">
                  ANBI Status <ExternalLink size={11} />
                </a>
              </li>
            </ul>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-1">KvK nummer</div>
              <div className="text-sm text-white/70 font-mono">XX.XXX.XXX</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/40 text-center sm:text-left">
            © {new Date().getFullYear()} Stichting SLNL. Alle rechten voorbehouden.
          </p>
          <p className="text-xs text-white/30 text-center">
            Somaliland — Land van hoop en vrijheid
          </p>
        </div>
      </div>
    </footer>
  );
}
