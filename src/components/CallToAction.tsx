import { ArrowRight, Heart } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/2310713/pexels-photo-2310713.jpeg"
          alt="Gemeenschap"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-forest-900/85" />
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-forest-600 via-white to-somali-red opacity-60" />
        <div className="absolute -top-24 right-0 w-80 h-80 bg-forest-700/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 left-0 w-64 h-64 bg-forest-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Heart size={28} className="text-white" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
          Sluit je aan bij{' '}
          <span className="text-forest-300">onze gemeenschap</span>
        </h2>
        <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">
          Word lid van Stichting SLNL en draag bij aan een sterke, zichtbare en trotse
          Somalilandse gemeenschap in Nederland. Samen zijn we sterker.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => document.querySelector('#evenementen')?.scrollIntoView({ behavior: 'smooth' })}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-forest-900 font-bold rounded-xl hover:bg-forest-50 active:scale-95 transition-all duration-200 shadow-xl"
          >
            Doe Mee
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white/30 hover:border-white hover:bg-white/10 active:scale-95 transition-all duration-200"
          >
            Neem Contact Op
          </a>
        </div>
      </div>
    </section>
  );
}
