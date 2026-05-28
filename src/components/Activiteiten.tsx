import { Calendar, BookOpen, GraduationCap, Handshake } from 'lucide-react';

const activities = [
  {
    icon: Calendar,
    title: '18 Mei Viering',
    description:
      'De nationale feestdag van Somaliland wordt elk jaar groots gevierd in Nederland. Een dag van trots, cultuur, muziek en samenzijn voor de hele gemeenschap.',
    tag: 'Jaarlijks',
    tagColor: 'bg-forest-100 text-forest-800',
  },
  {
    icon: BookOpen,
    title: 'Cultuur & Educatie',
    description:
      'Via workshops, lezingen en culturele programma\'s bewaren en delen we de rijke Somalilandse cultuur, taal en geschiedenis met nieuwe generaties.',
    tag: 'Doorlopend',
    tagColor: 'bg-amber-100 text-amber-800',
  },
  {
    icon: GraduationCap,
    title: 'Jongeren',
    description:
      'Speciale programma\'s voor jongeren: mentorschap, talentontwikkeling en leiderschapstrainingen om de volgende generatie te empoweren.',
    tag: 'Jongeren',
    tagColor: 'bg-sky-100 text-sky-800',
  },
  {
    icon: Handshake,
    title: 'Samenwerking',
    description:
      'We werken samen met Nederlandse organisaties, overheidsinstanties en internationale partners om de positie van Somaliland te versterken.',
    tag: 'Partners',
    tagColor: 'bg-rose-100 text-rose-800',
  },
];

export default function Activiteiten() {
  return (
    <section id="activiteiten" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-forest-50 text-forest-700 text-xs font-bold uppercase tracking-widest rounded-full border border-forest-100 mb-4">
              Activiteiten
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
              Wat wij doen
            </h2>
          </div>
          <p className="text-gray-500 lg:max-w-sm text-sm lg:text-base">
            Van jaarlijkse vieringen tot dagelijkse gemeenschapsondersteuning — onze activiteiten
            raken elk aspect van het Somalilandse leven in Nederland.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.title}
                className="group relative rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Background number */}
                <div className="absolute -bottom-4 -right-2 text-8xl font-black text-gray-50 pointer-events-none select-none">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 bg-forest-800 rounded-xl flex items-center justify-center mb-5 group-hover:bg-forest-700 transition-colors">
                  <Icon size={22} className="text-white" />
                </div>

                {/* Tag */}
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${activity.tagColor}`}>
                  {activity.tag}
                </span>

                <h3 className="font-bold text-gray-900 text-lg mb-3">{activity.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{activity.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
