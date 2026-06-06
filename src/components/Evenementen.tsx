import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Clock, MapPin, ArrowRight, Loader2, X, ArrowLeft, BookOpen, GraduationCap, Handshake } from 'lucide-react';

// --- HIER STAAN JE VASTE ACTIVITEITEN ---
const activities = [
  { icon: Calendar, title: '18 Mei Viering', description: 'De nationale feestdag van Somaliland wordt elk jaar groots gevierd in Nederland. Een dag van trots, cultuur, muziek en samenzijn voor de hele gemeenschap.', tag: 'Jaarlijks', tagColor: 'bg-[#E2F0E9] text-[#114232]' },
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

  // --- DE NIEUWE MOLLIE BETAAL LOGICA ZIT HIER ---
  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    try {
      if (selectedRegEvent?.betaald_evenement) {
        
        await supabase.auth.getSession();
        
        const { data, error: functionError } = await supabase.functions.invoke('maak-betaling', {
          body: {
            amount: selectedRegEvent.betaal_bedrag || 0,
            description: `Ticket: ${selectedRegEvent.titel}`,
            orderId: `SLNL_${Date.now()}`,
            returnUrl: `${window.location.origin}/succes` 
          },
          // De supabase client voegt nu automatisch de juiste header toe
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          }
        });

        if (functionError) throw functionError;

        // 2. Sla alvast de inschrijving in je database op met status 'pending'
        const { error: dbError } = await supabase.from('inschrijvingen').insert([{
          evenement_titel: selectedRegEvent.titel,
          naam: regNaam,
          email: regEmail,
          payment_id: data.paymentId, // <-- Controleer of hier data.paymentId staat!
          payment_status: 'pending',
          payment_amount: selectedRegEvent.betaal_bedrag || 0
        }]);

        if (dbError) throw dbError;

        // 3. Stuur de bezoeker door naar de Mollie iDEAL pagina
        if (data?.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        }

      } else {
        // Gratis evenement
        const { error } = await supabase.from('inschrijvingen').insert([{ evenement_titel: selectedRegEvent.titel, naam: regNaam, email: regEmail }]);
        if (!error) { setRegSucces(true); setRegNaam(''); setRegEmail(''); } 
        else { alert("Er ging iets mis: " + error.message); }
      }
    } catch (err: any) {
      alert('Er ging iets mis: ' + (err.message || JSON.stringify(err)));
    }
    setRegLoading(false);
  };

  const getBadge = (event: any) => {
    if (event.is_hoofdevenement) return <span className="absolute top-4 left-4 bg-[#E2F0E9] text-[#114232] px-3 py-1.5 rounded-full text-xs font-black shadow-sm">Hoofdevenement</span>;
    if (event.type) return <span className="absolute top-4 left-4 bg-white/95 text-gray-800 px-3 py-1.5 rounded-full text-xs font-black shadow-sm">{event.type}</span>;
    return null;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#114232]"><Loader2 className="animate-spin" size={32} /></div>;

  // --- DETAILPAGINA (MEER INFO) ---
  if (activeDetailPage) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20 text-gray-900 animate-fade-in">
        <div className="max-w-4xl mx-auto px-4">
          <button onClick={() => setActiveDetailPage(null)} className="inline-flex items-center gap-2 text-[#114232] font-bold mb-8 hover:opacity-80 transition"><ArrowLeft size={20} /> Terug naar overzicht</button>
          
          <div className="rounded-3xl overflow-hidden shadow-xl mb-10 h-96 bg-gray-100">
            <img src={activeDetailPage.afbeelding_url} alt={activeDetailPage.titel} className="w-full h-full object-cover" />
          </div>
          
          <h1 className="text-4xl font-black mb-6">{activeDetailPage.titel}</h1>

          {/* DE NIEUWE PRIJS & BETAAL BOX OP DE DETAILPAGINA */}
          <div className="bg-[#F8FAF9] border border-[#E2F0E9] p-6 rounded-2xl mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div>
              <span className="text-gray-500 text-sm font-bold uppercase tracking-wider block mb-1">Prijs per ticket</span>
              <div className="text-3xl font-black text-[#114232]">
                {activeDetailPage.betaald_evenement ? `€${Number(activeDetailPage.betaal_bedrag || 0).toFixed(2)}` : 'Gratis'}
              </div>
            </div>
            
            {activeDetailPage.betaald_evenement ? (
              <button 
                onClick={() => setSelectedRegEvent(activeDetailPage)} 
                className="w-full sm:w-auto px-8 py-4 bg-[#114232] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-90 transition"
              >
                Koop Ticket <ArrowRight size={18} />
              </button>
            ) : activeDetailPage.inschrijven_mogelijk ? (
              <button 
                onClick={() => setSelectedRegEvent(activeDetailPage)} 
                className="w-full sm:w-auto px-8 py-4 bg-[#114232] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-90 transition"
              >
                Gratis Inschrijven <ArrowRight size={18} />
              </button>
            ) : (
              <div className="text-gray-500 italic font-medium px-4">Vrije inloop, inschrijven niet nodig.</div>
            )}
          </div>

          <div className="prose max-w-none text-lg text-gray-700 leading-relaxed whitespace-pre-line">{activeDetailPage.beschrijving}</div>
        </div>
        
        {/* Voeg de modal ook toe aan de detailpagina zodat hij hier kan openen */}
        {selectedRegEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative p-8 text-gray-900 animate-fade-in">
              <button onClick={() => setSelectedRegEvent(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
              
              <h3 className="text-2xl font-black mb-2">
                {selectedRegEvent.betaald_evenement ? 'Ticket Kopen' : 'Inschrijven'}
              </h3>
              
              <div className="mb-6 p-4 bg-[#F8FAF9] border border-[#E2F0E9] rounded-xl text-sm">
                Je reserveert voor: <strong className="text-[#114232]">{selectedRegEvent.titel}</strong>
                {selectedRegEvent.betaald_evenement && (
                  <div className="mt-2 text-[#114232] font-bold">Te betalen: €{Number(selectedRegEvent.betaal_bedrag || 0).toFixed(2)}</div>
                )}
              </div>

              {regLoading && selectedRegEvent.betaald_evenement ? (
                <div className="text-center py-6">
                  <Loader2 className="animate-spin mx-auto text-[#114232] mb-4" size={32} />
                  <p className="font-bold text-[#114232]">Je wordt doorgestuurd naar Mollie (iDEAL)...</p>
                </div>
              ) : (
                <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                  <input type="text" required value={regNaam} onChange={e => setRegNaam(e.target.value)} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#114232] outline-none transition" placeholder="Volledige naam" />
                  <input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#114232] outline-none transition" placeholder="E-mailadres" />
                  <button type="submit" disabled={regLoading} className="w-full py-4 bg-[#114232] text-white font-bold rounded-xl hover:bg-opacity-90 transition flex items-center justify-center gap-2">
                    {regLoading ? <Loader2 className="animate-spin" /> : selectedRegEvent.betaald_evenement ? 'Verder naar afrekenen' : 'Inschrijving Bevestigen'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- OVERZICHTSPAGINA ---
  return (
    <div className="min-h-screen bg-[#F8FAF9] pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- SECTIE 1: ACTIVITEITEN --- */}
        <section className="mb-24">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <span className="inline-block px-4 py-1.5 bg-[#E2F0E9] text-[#114232] text-xs font-bold uppercase tracking-widest rounded-full mb-4">Activiteiten</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">Wat wij doen</h2>
            </div>
            <p className="text-gray-500 lg:max-w-sm text-sm lg:text-base">Van jaarlijkse vieringen tot dagelijkse gemeenschapsondersteuning — onze activiteiten raken elk aspect van het Somalilandse leven in Nederland.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.title} className="group relative rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                  <div className="w-12 h-12 bg-[#114232] rounded-xl flex items-center justify-center mb-5"><Icon size={22} className="text-white" /></div>
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
                  <div className="flex items-center gap-3"><Calendar size={18} className="text-[#114232]" /><span>{new Date(event.datum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                  <div className="flex items-center gap-3"><Clock size={18} className="text-[#114232]" /><span>{event.tijd}</span></div>
                  <div className="flex items-center gap-3"><MapPin size={18} className="text-[#114232]" /><span>{event.locatie}</span></div>
                </div>
                {event.betaald_evenement && (
                  <div className="mb-4 bg-[#F8FAF9] p-3 rounded-lg border border-[#E2F0E9] inline-block">
                    <span className="text-xs font-bold text-gray-500 uppercase">Prijs</span>
                    <div className="text-xl font-black text-[#114232]">€{Number(event.betaal_bedrag || 0).toFixed(2)}</div>
                  </div>
                )}
                
                <button onClick={() => setActiveDetailPage(event)} className="w-full py-4 mt-auto bg-[#F8FAF9] text-[#114232] border border-[#E2F0E9] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#E2F0E9] transition">
                  Meer info <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL VOOR OVERZICHTSPAGINA */}
      {selectedRegEvent && !activeDetailPage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative p-8 text-gray-900">
            <button onClick={() => setSelectedRegEvent(null)} className="absolute top-4 right-4 text-gray-400"><X size={24} /></button>
            <h3 className="text-2xl font-black mb-2">Inschrijven</h3>
            {regSucces ? (
              <div className="bg-green-50 text-green-800 p-6 rounded-xl text-center font-bold">🎉 Inschrijving succesvol!</div>
            ) : (
              <>
                <div className="mb-6 p-4 bg-[#F8FAF9] border border-[#E2F0E9] rounded-xl text-sm">
                  Je reserveert voor: <strong className="text-[#114232]">{selectedRegEvent.titel}</strong>
                  {selectedRegEvent.betaald_evenement && (
                    <div className="mt-2 text-[#114232] font-bold">Te betalen: €{Number(selectedRegEvent.betaal_bedrag || 0).toFixed(2)}</div>
                  )}
                </div>
                
                {regLoading && selectedRegEvent.betaald_evenement ? (
                  <div className="text-center py-6">
                    <Loader2 className="animate-spin mx-auto text-[#114232] mb-4" size={32} />
                    <p className="font-bold text-[#114232]">Je wordt doorgestuurd naar Mollie...</p>
                  </div>
                ) : (
                  <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                    <input type="text" required value={regNaam} onChange={e => setRegNaam(e.target.value)} className="w-full p-4 border rounded-xl" placeholder="Volledige naam" />
                    <input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} className="w-full p-4 border rounded-xl" placeholder="E-mailadres" />
                    <button type="submit" disabled={regLoading} className="w-full py-4 bg-[#114232] text-white font-bold rounded-xl flex items-center justify-center gap-2">
                      {regLoading ? <Loader2 className="animate-spin" /> : selectedRegEvent.betaald_evenement ? 'Verder naar afrekenen' : 'Bevestigen'}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}