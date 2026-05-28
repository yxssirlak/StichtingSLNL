import { ArrowRight, CheckCircle } from 'lucide-react';

const highlights = [
  'Gemeenschapsopbouw in heel Nederland',
  'Culturele evenementen en vieringen',
  'Jeugdprogramma\'s en begeleiding',
  'Internationale erkenning van Somaliland',
];

export default function OverOns() {
  return (
    <section id="over-ons" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-forest-50 text-forest-700 text-xs font-bold uppercase tracking-widest rounded-full border border-forest-100">
            Over Ons
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Images grid */}
          <div className="relative grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
              <img
                src="https://images.pexels.com/photos/6647037/pexels-photo-6647037.jpeg"
                alt="Gemeenschap bijeenkomst"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[3/4] mt-8 shadow-lg">
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg"
                alt="Cultureel evenement"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-forest-50 rounded-2xl -z-10" />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-forest-100 rounded-2xl -z-10" />

            {/* Badge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-forest-800 text-white rounded-xl px-5 py-3 shadow-xl text-center whitespace-nowrap">
              <div className="text-lg font-black">Opgericht 2012</div>
              <div className="text-xs opacity-80">Verbindende factor in NL</div>
            </div>
          </div>

          {/* Text block */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
              De verbindende factor voor{' '}
              <span className="text-forest-800">Somaliland</span> in Nederland
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6 text-base lg:text-lg">
              Sinds 2012 is Stichting SLNL de verbindende factor voor de Somalilandse gemeenschap
              in Nederland. Wij organiseren culturele evenementen, bieden ondersteuning aan
              nieuwkomers en werken aan de internationale erkenning van Somaliland.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8 text-base lg:text-lg">
              Onze stichting brengt mensen samen, versterkt culturele identiteit en zorgt ervoor
              dat de Somalilandse stem in Nederland gehoord wordt.
            </p>

            {/* Highlights list */}
            <ul className="space-y-3 mb-8">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-forest-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm lg:text-base">{item}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => document.querySelector('#gemeenschap')?.scrollIntoView({ behavior: 'smooth' })}
              className="group inline-flex items-center gap-2 px-6 py-3.5 bg-forest-800 text-white font-semibold rounded-xl hover:bg-forest-700 active:scale-95 transition-all duration-200 shadow-lg shadow-forest-800/20"
            >
              Lees Verder
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
