import { Target, Eye, Flag, ShieldCheck } from 'lucide-react';

export default function OverOns() {
  return (
    <div className="w-full bg-white pb-20">
      
      {/* Pagina Header Banner */}
      <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-forest-950 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/DSC00129a.jpg" 
            alt="Somaliland" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Over Stichting SLNL
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-light">
            De verbindende factor voor de Somalilandse gemeenschap in Nederland sinds 2012.
          </p>
        </div>
      </div>

      {/* Het Verhaal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 lg:mt-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-6">Over Ons</h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Wij zijn een organisatie van en voor de Somalilandse gemeenschap. Vanuit onze gedeelde achtergrond en onze verbondenheid met zowel Somaliland als Nederland zetten wij ons in voor het versterken, ondersteunen en zichtbaar maken van onze gemeenschap.
            </p>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Wij geloven in de kracht van verbinding, emancipatie en gemeenschapszin. Daarom werken wij aan het creëren van kansen, het bevorderen van participatie en het versterken van de positie van Somalilanders in Nederland. Daarbij willen wij mensen inspireren, ondersteunen en samen bouwen aan een sterke en trotse gemeenschap.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Onze liefde voor zowel Somaliland als Nederland vormt de basis van onze missie. Wij willen een brug slaan tussen beide landen door wederzijds begrip, samenwerking en kennisuitwisseling te bevorderen. Zo dragen wij bij aan een toekomst waarin beide samenlevingen elkaar versterken en waarin de Somalilandse gemeenschap een herkenbare en positieve bijdrage levert aan de maatschappij.
            </p>
          </div>
          <div className="relative flex justify-center">
            <div className="aspect-square rounded-full bg-forest-50 absolute -inset-4 lg:-inset-8 -z-10" />
            <img 
              src="/SLNL_logo.png" 
              alt="Team" 
              className="w-full max-w-[220px] h-auto object-contain rounded-2xl shadow-xl bg-white p-4"
            />
          </div>
        </div>
      </div>

      {/* Missie en Visie Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-forest-50 p-10 rounded-3xl border border-forest-100">
            <div className="w-16 h-16 bg-forest-800 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
              <Target size={32} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Onze Missie</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              Onze missie is het versterken, verbinden en emanciperen van de Somalilandse gemeenschap in Nederland. Wij bieden een platform voor ontmoeting, educatie en culturele uitwisseling. Tegelijkertijd bouwen wij actieve bruggen tussen Nederland en Somaliland om bij te dragen aan wederzijds begrip en ontwikkeling.
            </p>
          </div>

          <div className="bg-gray-50 p-10 rounded-3xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
              <Eye size={32} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Onze Visie</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              Wij zien een toekomst voor ons waarin Somalilanders volledig en succesvol participeren in de Nederlandse maatschappij, met behoud van hun unieke culturele identiteit en trots. Daarnaast streven wij naar de dag waarop Somaliland de internationale diplomatieke erkenning krijgt die het verdient als stabiele, democratische natie.
            </p>
          </div>
        </div>
      </div>

      {/* Kernwaarden */}
      <div className="bg-forest-900 mt-24 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white">Onze Kernwaarden</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center text-white mb-6">
                <Flag size={32} />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Identiteit & Trots</h4>
              <p className="text-white/70">We koesteren onze rijke Somalilandse cultuur, poëzie en democratische tradities.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center text-white mb-6">
                <ShieldCheck size={32} />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Samenwerking</h4>
              <p className="text-white/70">Alleen ga je sneller, samen kom je verder. We werken lokaal en internationaal samen.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center text-white mb-6">
                <Target size={32} />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Vooruitgang</h4>
              <p className="text-white/70">We stimuleren ondernemerschap, educatie en politieke participatie onder de jeugd.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}