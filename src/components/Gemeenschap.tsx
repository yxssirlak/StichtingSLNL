import { Users, Zap, Globe, Star } from 'lucide-react';

const pillars = [
  {
    icon: Users,
    title: 'Hechte Gemeenschap',
    description:
      'Wij verbinden Somalilandse Nederlanders van alle generaties en regio\'s. Samen bouwen we een sterke gemeenschap die elkaar ondersteunt en inspireert.',
    image: 'https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg',
    color: 'bg-forest-50 border-forest-100',
    iconColor: 'bg-forest-800',
  },
  {
    icon: Zap,
    title: 'Actief & Ondernemend',
    description:
      'Onze gemeenschap staat bekend om haar energie en ondernemersgeest. We stimuleren initiatieven die bijdragen aan de Nederlandse samenleving.',
    image: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg',
    color: 'bg-amber-50 border-amber-100',
    iconColor: 'bg-amber-600',
  },
  {
    icon: Globe,
    title: 'Verbonden Met Thuis',
    description:
      'Ondanks de afstand blijven we verbonden met Somaliland. We ondersteunen de ontwikkeling van ons thuisland en werken aan internationale erkenning.',
    image: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg',
    color: 'bg-sky-50 border-sky-100',
    iconColor: 'bg-sky-700',
  },
  {
    icon: Star,
    title: 'Cultuur & Trots',
    description:
      'Onze rijke cultuur, taal en tradities worden levend gehouden. Van de Las Geel grottekeningen tot moderne Somalilandse kunst — wij zijn trots op wie we zijn.',
    image: 'https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg',
    color: 'bg-rose-50 border-rose-100',
    iconColor: 'bg-somali-red',
  },
];

export default function Gemeenschap() {
  return (
    <section id="gemeenschap" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-white text-forest-700 text-xs font-bold uppercase tracking-widest rounded-full border border-forest-100 mb-4">
            Onze Gemeenschap
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4">
            Wie wij zijn
          </h2>
          <p className="text-gray-500 text-base lg:text-lg">
            De Somalilandse gemeenschap in Nederland is divers, energiek en cultureel rijk.
            Vier pijlers definiëren wie wij zijn.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className={`group rounded-2xl border ${pillar.color} p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Image */}
                <div className="rounded-xl overflow-hidden aspect-[4/3] mb-5 shadow-sm">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Icon */}
                <div className={`w-10 h-10 ${pillar.iconColor} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={20} className="text-white" />
                </div>

                <h3 className="font-bold text-gray-900 text-base mb-2">{pillar.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
