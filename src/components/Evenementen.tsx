import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Clock, MapPin, Users, ArrowRight, Loader2, X, ArrowLeft, BookOpen, GraduationCap, Handshake } from 'lucide-react';

// --- HIER STAAN JE VASTE ACTIVITEITEN ---
const activities = [
  { icon: Calendar, title: '18 Mei Viering', description: 'De nationale feestdag van Somaliland wordt elk jaar groots gevierd in Nederland. Een dag van trots, cultuur, muziek en samenzijn voor de hele gemeenschap.', tag: 'Jaarlijks', tagColor: 'bg-forest-100 text-forest-800' },
  { icon: BookOpen, title: 'Cultuur & Educatie', description: 'Via workshops, lezingen en culturele programma\'s bewaren en delen we de rijke Somalilandse cultuur, taal en geschiedenis met nieuwe generaties.', tag: 'Doorlopend', tagColor: 'bg-amber-100 text-amber-800' },
  { icon: GraduationCap, title: 'Jongeren', description: 'Speciale programma\'s voor jongeren: mentorschap, talentontwikkeling en leiderschapstrainingen om de volgende generatie te empoweren.', tag: 'Jongeren', tagColor: 'bg-sky-100 text-sky-800' },
  { icon: Handshake, title: 'Samenwerking', description: 'We werken samen met Nederlandse organisaties, overheidsinstanties en internationale partners om de positie van Somaliland te versterken.', tag: 'Partners', tagColor: 'bg-rose-100 text-rose-800' },
];

export default function Evenementen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegEvent, setSelectedRegEvent] = useState<any>(null);
  const [activeDetailPage, setActiveDetailPage] = useState<any>(null);
  const [regNaam, setRegNaam] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSucces, setRegSucces] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const vandaag = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('evenementen')
      .select('*')
      .gte('datum', vandaag)
      .order('datum', { ascending: true })
      .order('tijd', { ascending: true });
    if (data) setEvents(data);
    setLoading(false);
  }

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    const { error } = await supabase.from('inschrijvingen').insert([{ evenement_titel: selectedRegEvent.titel, naam: regNaam, email: regEmail }]);
    if (!error) { setRegSucces(true); setRegNaam(''); setRegEmail(''); } 
    else { alert("Er ging iets mis: " + error.message); }
    setRegLoading(false);
  };

  const getBadge = (event: any) => {
    if (event.is_hoofdevenement) return <span className="absolute top-4 left-4 bg-[#E2F0E9] text-forest-800 px-3 py-1.5 rounded-full text-xs font-black shadow-sm">Hoofdevenement</span>;
    if (event.type) return <span className="absolute top-4 left-4 bg-white/95 text-gray-800 px-3 py-1.5 rounded-full text-xs font-black shadow-sm">{event.type}</span>;
    return null;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-forest-800"><Loader2 className="animate-spin" size={32} /></div>;

  if (activeDetailPage) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20 text-gray-900 animate-fade-in">
        <div className="max-w-4xl mx-auto px-4">
          <button onClick={() => setActiveDetailPage(null)} className="inline-flex items-center gap-2 text-forest-800 font-bold mb-8 hover:text-forest-600"><ArrowLeft size={20} /> Terug naar overzicht</button>
          <div className="rounded-3xl overflow-hidden shadow-xl mb-10 h-96 bg-gray-100"><img src={activeDetailPage.afbeelding_url} alt={activeDetailPage.titel} className="w-full h-full object-cover" /></div>
          <h1 className="text-4xl font-black mb-6">{activeDetailPage.titel}</h1>
          <div className="prose max-w-none text-lg text-gray-700 leading-relaxed whitespace-pre-line">{activeDetailPage.beschrijving}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- SECTIE 1: ACTIVITEITEN --- */}
        <section className="mb-24">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <span className="inline-block px-4 py-1.5 bg-forest-50 text-forest-700 text-xs font-bold uppercase tracking-widest rounded-full border border-forest-100 mb-4">Activiteiten</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">Wat wij doen</h2>
            </div>
            <p className="text-gray-500 lg:max-w-sm text-sm lg:text-base">Van jaarlijkse vieringen tot dagelijkse gemeenschapsondersteuning — onze activiteiten raken elk aspect van het Somalilandse leven in Nederland.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={activity.title} className="group relative rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-xl transition-all duration-300">
                  <div className="absolute -bottom-4 -right-2 text-8xl font-black text-gray-50 pointer-events-none">{String(index + 1).padStart(2, '0')}</div>
                  <div className="w-12 h-12 bg-forest-800 rounded-xl flex items-center justify-center mb-5"><Icon size={22} className="text-white" /></div>
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${activity.tagColor}`}>{activity.tag}</span>
                  <h3 className="font-bold text-gray-900 text-lg mb-3">{activity.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{activity.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* --- SECTIE 2: EVENEMENTEN --- */}
        <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">Aankomende Evenementen</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.titel} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="relative h-56 bg-gray-100"><img src={event.afbeelding_url} alt={event.titel} className="w-full h-full object-cover" />{getBadge(event)}</div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-black mb-4">{event.titel}</h2>
                <div className="space-y-2 mb-6 text-sm text-gray-600">
                  <div className="flex items-center gap-3"><Calendar size={18} className="text-forest-700" /><span>{new Date(event.datum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                  <div className="flex items-center gap-3"><Clock size={18} className="text-forest-700" /><span>{event.tijd}</span></div>
                  <div className="flex items-center gap-3"><MapPin size={18} className="text-forest-700" /><span>{event.locatie}</span></div>
                </div>
                {event.inschrijven_mogelijk ? (
                  <button onClick={() => { setSelectedRegEvent(event); setRegSucces(false); }} className="w-full py-4 bg-forest-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-forest-700">Inschrijven <ArrowRight size={18} /></button>
                ) : (
                  <button onClick={() => setActiveDetailPage(event)} className="w-full py-4 bg-gray-100 text-gray-800 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200">Meer info <ArrowRight size={18} /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL (Blijft hetzelfde) */}
      {selectedRegEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative p-8 text-gray-900">
            <button onClick={() => setSelectedRegEvent(null)} className="absolute top-4 right-4 text-gray-400"><X size={24} /></button>
            <h3 className="text-2xl font-black mb-2">Inschrijven</h3>
            {regSucces ? <div className="bg-green-50 text-green-800 p-6 rounded-xl text-center font-bold">🎉 Inschrijving succesvol!</div> : (
              <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                <input type="text" required value={regNaam} onChange={e => setRegNaam(e.target.value)} className="w-full p-3 border rounded-xl" placeholder="Volledige naam" />
                <input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} className="w-full p-3 border rounded-xl" placeholder="E-mailadres" />
                <button type="submit" disabled={regLoading} className="w-full py-4 bg-forest-800 text-white font-bold rounded-xl">{regLoading ? <Loader2 className="animate-spin" /> : 'Bevestigen'}</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}