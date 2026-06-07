import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Calendar, Globe, Heart } from 'lucide-react';

export default function Home() {
  const scrollToContent = () => {
    document.querySelector('#welkom')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* 1. HERO SECTIE */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden bg-forest-50/30">
        
        {/* Achtergrond gloed en patroon */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#1d533d_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-forest-200/40 blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-red-100/30 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Tekst kant (Linkerzijde) */}
            <div className="order-2 lg:order-1 animate-slide-up">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-forest-100 rounded-full mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-forest-600 animate-pulse" />
                <span className="text-xs font-bold text-forest-800 uppercase tracking-wider">
                  Stichting Somaliland Nederland
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-4">
                Meer zichtbaar, <br/><span className="text-forest-800">meer samen!</span>
              </h1>
              
              <p className="text-xl sm:text-2xl font-semibold text-forest-700 italic mb-6 font-serif">
                "Ismuujin iyo midnimo"
              </p>
              
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-10 max-w-xl">
                Stichting SLNL versterkt de Somalilandse gemeenschap in Nederland en bouwt bruggen
                voor de internationale erkenning van Somaliland.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-12">
                <Link to="/evenementen" className="group inline-flex items-center gap-2 px-7 py-4 bg-forest-800 text-white font-semibold rounded-xl hover:bg-forest-700 active:scale-95 transition-all duration-200 shadow-lg shadow-forest-800/20">
                  Bekijk Evenementen
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-4 bg-white text-forest-800 font-semibold rounded-xl border-2 border-forest-200 hover:border-forest-400 hover:bg-forest-50 active:scale-95 transition-all duration-200">
                  Neem Contact Op
                </Link>
              </div>

              {/* Kernwaarden */}
              <div className="flex gap-6 sm:gap-10 pt-8 border-t border-forest-200/60">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-forest-800">Cultuur</div>
                  <div className="text-sm font-medium text-gray-500 mt-1">Trots op onze afkomst</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-forest-800">Verbinding</div>
                  <div className="text-sm font-medium text-gray-500 mt-1">Samen in Nederland</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-forest-800">Toekomst</div>
                  <div className="text-sm font-medium text-gray-500 mt-1">Bouwen aan morgen</div>
                </div>
              </div>
            </div>

            {/* Foto kant (Rechterzijde) */}
            <div className="order-1 lg:order-2 relative animate-fade-in mt-6 lg:mt-0">
              <div className="absolute -top-6 -right-6 w-full h-full border-2 border-forest-200 rounded-2xl hidden lg:block" />
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-auto lg:h-[580px] bg-white">
                {/* Geen lazy loading hier, want dit is bovenaan de pagina! */}
                <img src="/Nature.jpg" alt="Somaliland Natuur" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 via-forest-900/10 to-transparent" />
                
                {/* Zwevend Info Kaartje over de foto */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/20">
                  <div className="flex items-center gap-4">
                    {/* Geen lazy loading voor het logo */}
                    <img src="/SLNL_logo.png" alt="SLNL" className="w-12 h-12 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-forest-900 text-sm">Trots op onze cultuur</p>
                      <p className="text-xs font-medium text-forest-700/80">Somaliland Erfgoed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        <button onClick={scrollToContent} className="absolute bottom-6 left-1/2 -translate-x-1/2 text-forest-300 hover:text-forest-700 transition-colors animate-bounce z-20">
          <ChevronDown size={36} />
        </button>
      </section>

      {/* 2. WELKOM / OVER ONS PREVIEW */}
      <section id="welkom" className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-2 gap-4">
              {/* LAZY LOADING TOEGEVOEGD HIER */}
              <img src="/AL7W0409a.jpg" alt="Community" className="w-full h-64 object-cover rounded-2xl mt-8 shadow-lg" loading="lazy" />
              <img src="/AL7W0538a.jpg" alt="Samenwerking" className="w-full h-64 object-cover rounded-2xl shadow-lg" loading="lazy" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-6">Sinds 2012 de verbindende factor</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Wij geloven dat we samen sterker staan. Stichting SLNL is opgericht met een helder doel: de Somalilandse gemeenschap in Nederland verenigen, ondersteunen en zichtbaarder maken. 
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We organiseren evenementen, bieden educatieve programma's voor jongeren en werken hard aan het bouwen van bruggen tussen Nederland en Somaliland.
              </p>
              <Link to="/over-ons" className="inline-flex items-center gap-2 text-forest-800 font-bold hover:text-forest-600 transition-colors text-lg">
                Lees ons volledige verhaal <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ONZE PIJLERS */}
      <section className="py-20 lg:py-32 bg-forest-50 border-y border-forest-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Wat wij doen</h2>
            <p className="text-lg text-gray-600">Ontdek hoe we impact maken in Nederland en daarbuiten.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-16 h-16 bg-forest-50 rounded-2xl flex items-center justify-center text-forest-800 mb-8 group-hover:bg-forest-800 group-hover:text-white transition-colors duration-300">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Onze Gemeenschap</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">Een hechte groep van ondernemers, studenten en professionals die elkaar steunen en vooruit helpen.</p>
              <Link to="/gemeenschap" className="inline-flex items-center gap-2 text-forest-800 font-semibold hover:gap-3 transition-all">Bekijk de gemeenschap <ArrowRight size={16}/></Link>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-16 h-16 bg-forest-50 rounded-2xl flex items-center justify-center text-forest-800 mb-8 group-hover:bg-forest-800 group-hover:text-white transition-colors duration-300">
                <Calendar size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Activiteiten</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">Van de jaarlijkse 18 Mei viering tot workshops en lezingen voor de nieuwe generatie.</p>
              <Link to="/activiteiten" className="inline-flex items-center gap-2 text-forest-800 font-semibold hover:gap-3 transition-all">Ontdek activiteiten <ArrowRight size={16}/></Link>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-16 h-16 bg-forest-50 rounded-2xl flex items-center justify-center text-forest-800 mb-8 group-hover:bg-forest-800 group-hover:text-white transition-colors duration-300">
                <Globe size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Erkenning & Trots</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">We zetten ons in voor de internationale erkenning van Somaliland en dragen onze rijke cultuur met trots uit.</p>
              <Link to="/over-ons" className="inline-flex items-center gap-2 text-forest-800 font-semibold hover:gap-3 transition-all">Lees onze missie <ArrowRight size={16}/></Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. UITGELICHTE BANNER: 18 MEI VIERING */}
      <section className="bg-forest-800 py-12 relative overflow-hidden">
        {/* Decoratieve achtergrond elementen */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-forest-700 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-forest-900 rounded-full blur-3xl opacity-50 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6 sm:gap-8">
              <div className="w-24 h-24 bg-white rounded-2xl flex flex-col items-center justify-center text-forest-800 shadow-2xl rotate-3 flex-shrink-0">
                <span className="text-4xl font-black leading-none">18</span>
                <span className="text-sm font-bold uppercase tracking-wider mt-1">Mei</span>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">Nationale Dag van Somaliland</h3>
                <p className="text-forest-100 text-lg max-w-xl">Vier samen met ons de onafhankelijkheid, onze rijke geschiedenis en onze prachtige cultuur.</p>
              </div>
            </div>
            
            <Link to="/evenementen" className="px-8 py-4 bg-white text-forest-800 font-bold rounded-xl hover:bg-forest-50 active:scale-95 transition-all shadow-xl whitespace-nowrap">
              Bekijk Viering
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FOTOGALERIJ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-10 text-center">In Beeld</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LAZY LOADING TOEGEVOEGD HIER */}
            <img src="/IMG_6191.jpg" alt="Evenement 1" className="w-full h-80 object-cover rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer" loading="lazy" />
            <img src="/AL7W0529a.jpg" alt="Evenement 2" className="w-full h-80 object-cover rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer" loading="lazy" />
            <img src="/IMG_6773.jpg" alt="Evenement 3" className="w-full h-80 object-cover rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer" loading="lazy" />
          </div>
        </div>
      </section>
    </div>
  );
}