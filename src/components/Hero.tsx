import { ArrowRight, ChevronDown } from 'lucide-react';

export default function Hero() {
  const scrollToOverOns = () => {
    document.querySelector('#over-ons')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToEvenementen = () => {
    document.querySelector('#evenementen')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-16 lg:pt-20 overflow-hidden bg-gradient-to-br from-gray-50 to-white"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-forest-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute bottom-0 -left-12 w-72 h-72 bg-forest-50 rounded-full opacity-60 blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text side */}
          <div className="order-2 lg:order-1 animate-slide-up">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-forest-50 border border-forest-200 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-forest-600 animate-pulse" />
              <span className="text-xs font-semibold text-forest-700 uppercase tracking-wider">
                Somaliland Nederland
              </span>
            </div>

            {/* Headlines */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-3">
              Meer zichtbaar,{' '}
              <span className="text-forest-800">meer samen!</span>
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-forest-700 italic mb-6 font-serif">
              "Ismuujin iyo midnimo"
            </p>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
              Stichting SLNL versterkt de Somalilandse gemeenschap in Nederland en bouwt bruggen
              voor de internationale erkenning van Somaliland.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={scrollToEvenementen}
                className="group inline-flex items-center gap-2 px-7 py-4 bg-forest-800 text-white font-semibold rounded-xl hover:bg-forest-700 active:scale-95 transition-all duration-200 shadow-lg shadow-forest-800/20"
              >
                Bekijk Evenementen
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={scrollToOverOns}
                className="inline-flex items-center gap-2 px-7 py-4 bg-white text-forest-800 font-semibold rounded-xl border-2 border-forest-200 hover:border-forest-400 hover:bg-forest-50 active:scale-95 transition-all duration-200"
              >
                Over Ons
              </button>
            </div>

            {/* Stats row */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-gray-200">
              <div>
                <div className="text-2xl font-black text-forest-800">2012</div>
                <div className="text-sm text-gray-500 mt-0.5">Opgericht</div>
              </div>
              <div>
                <div className="text-2xl font-black text-forest-800">NL</div>
                <div className="text-sm text-gray-500 mt-0.5">Heel Nederland</div>
              </div>
              <div>
                <div className="text-2xl font-black text-forest-800">18 Mei</div>
                <div className="text-sm text-gray-500 mt-0.5">Jaarlijkse Viering</div>
              </div>
            </div>
          </div>

          {/* Image side */}
          <div className="order-1 lg:order-2 relative animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-auto lg:h-[520px]">
              <img
                src="https://images.pexels.com/photos/3889729/pexels-photo-3889729.jpeg"
                alt="Somaliland landscape - Las Geel caves"
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-forest-900/40 via-transparent to-transparent" />

              {/* Caption card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <img src="/SLNL_logo.png" alt="SLNL" className="w-10 h-10 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Somaliland</p>
                    <p className="text-xs text-gray-500">Cultuur &amp; Erfgoed</p>
                  </div>
                  {/* Somaliland flag colors mini strip */}
                  <div className="ml-auto flex gap-1">
                    <div className="w-3 h-6 bg-forest-700 rounded-sm" />
                    <div className="w-3 h-6 bg-white border border-gray-200 rounded-sm" />
                    <div className="w-3 h-6 bg-somali-red rounded-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-forest-800 rounded-2xl flex flex-col items-center justify-center text-white shadow-xl rotate-3">
              <span className="text-2xl font-black leading-none">18</span>
              <span className="text-xs font-semibold uppercase tracking-wide">Mei</span>
              <span className="text-xs opacity-80">Viering</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToOverOns}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 hover:text-forest-700 transition-colors animate-bounce"
        aria-label="Scroll naar beneden"
      >
        <ChevronDown size={28} />
      </button>
    </section>
  );
}
