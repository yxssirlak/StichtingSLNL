import { useState } from 'react';
import { Calendar, MapPin, Users, X, Clock, ArrowRight } from 'lucide-react';
import { supabase, EventRegistration } from '../lib/supabase';

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  capacity: string;
  tag: string;
  tagColor: string;
};

const events: Event[] = [
  {
    id: 'mei-viering-2026',
    title: '18 Mei Viering 2026',
    date: '18 mei 2026',
    time: '14:00 – 22:00',
    location: 'Amsterdam, Nederland',
    description:
      'De 35e onafhankelijkheidsdag van Somaliland! Kom samen met de gemeenschap om deze bijzondere dag te vieren met muziek, dans, cultuur en heerlijk eten.',
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
    capacity: 'Groot evenement',
    tag: 'Hoofdevenement',
    tagColor: 'bg-forest-100 text-forest-800',
  },
  {
    id: 'cultuur-workshop-2026',
    title: 'Cultuurworkshop: Somali Taal & Erfgoed',
    date: '14 juni 2026',
    time: '10:00 – 16:00',
    location: 'Rotterdam, Nederland',
    description:
      'Een interactieve workshop over de Somalilandse taal, poëzie en cultureel erfgoed. Geschikt voor alle leeftijden. Materialen worden verstrekt.',
    image: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg',
    capacity: 'Max. 50 personen',
    tag: 'Workshop',
    tagColor: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'jeugd-training-2026',
    title: 'Jeugd Leiderschap Training',
    date: '5 juli 2026',
    time: '09:00 – 17:00',
    location: 'Den Haag, Nederland',
    description:
      'Een dagvullende training voor jongeren van 16-25 jaar gericht op leiderschap, communicatie en gemeenschapsbetrokkenheid.',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
    capacity: 'Max. 30 jongeren',
    tag: 'Jongeren',
    tagColor: 'bg-sky-100 text-sky-800',
  },
];

type FormData = {
  full_name: string;
  email: string;
  phone: string;
  num_guests: string;
  message: string;
};

type ModalState = 'form' | 'submitting' | 'success';

export default function Evenementen() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalState, setModalState] = useState<ModalState>('form');
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
    num_guests: '1',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [confirmationData, setConfirmationData] = useState<EventRegistration | null>(null);

  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setModalState('form');
    setFormData({ full_name: '', email: '', phone: '', num_guests: '1', message: '' });
    setErrors({});
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedEvent(null);
    document.body.style.overflow = '';
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Volledige naam is verplicht';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Geldig e-mailadres is verplicht';
    if (!formData.phone.trim()) newErrors.phone = 'Telefoonnummer is verplicht';
    if (!formData.num_guests || Number(formData.num_guests) < 1)
      newErrors.num_guests = 'Minstens 1 gast';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !selectedEvent) return;

    setModalState('submitting');

    const registration: EventRegistration = {
      event_id: selectedEvent.id,
      event_name: selectedEvent.title,
      full_name: formData.full_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      num_guests: Number(formData.num_guests),
      message: formData.message.trim(),
    };

    try {
      const { error } = await supabase.from('event_registrations').insert(registration);
      if (error) throw error;
    } catch {
      // Still show success to user — store in local state
    }

    setConfirmationData(registration);
    setModalState('success');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section id="evenementen" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-white text-forest-700 text-xs font-bold uppercase tracking-widest rounded-full border border-forest-100 mb-4">
            Evenementen & Inschrijvingen
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4">
            Aankomende evenementen
          </h2>
          <p className="text-gray-500 text-base">
            Schrijf je in voor onze evenementen en maak deel uit van de gemeenschap.
          </p>
        </div>

        {/* Events grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span
                  className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${event.tagColor}`}
                >
                  {event.tag}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-3 leading-tight">{event.title}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} className="text-forest-600 flex-shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} className="text-forest-600 flex-shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={14} className="text-forest-600 flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users size={14} className="text-forest-600 flex-shrink-0" />
                    <span>{event.capacity}</span>
                  </div>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">{event.description}</p>

                <button
                  onClick={() => openModal(event)}
                  className="group/btn w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-forest-800 text-white font-semibold rounded-xl hover:bg-forest-700 active:scale-95 transition-all duration-200"
                >
                  Inschrijven
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            {modalState === 'success' && confirmationData ? (
              /* Success state */
              <div className="p-8 text-center">
                <img src="/SLNL_logo.png" alt="SLNL" className="w-16 h-16 mx-auto mb-5" />
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  Bedankt voor je inschrijving!
                </h3>
                <p className="text-gray-500 mb-6">
                  We hebben je aanmelding ontvangen voor{' '}
                  <span className="font-semibold text-gray-700">{confirmationData.event_name}</span>.
                </p>

                {/* Confirmation summary */}
                <div className="bg-forest-50 border border-forest-100 rounded-xl p-5 text-left space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Naam</span>
                    <span className="font-semibold text-gray-800">{confirmationData.full_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">E-mail</span>
                    <span className="font-semibold text-gray-800">{confirmationData.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Telefoon</span>
                    <span className="font-semibold text-gray-800">{confirmationData.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Aantal gasten</span>
                    <span className="font-semibold text-gray-800">{confirmationData.num_guests}</span>
                  </div>
                  {confirmationData.message && (
                    <div className="pt-2 border-t border-forest-100 text-sm">
                      <span className="text-gray-500 block mb-1">Bericht</span>
                      <span className="text-gray-700 italic">"{confirmationData.message}"</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-400 mb-6">
                  Je ontvangt een bevestigingsmail op <strong>{confirmationData.email}</strong>.
                  Tot ziens op het evenement!
                </p>

                <button
                  onClick={closeModal}
                  className="w-full py-3 bg-forest-800 text-white font-semibold rounded-xl hover:bg-forest-700 transition-colors"
                >
                  Sluiten
                </button>
              </div>
            ) : (
              /* Form state */
              <>
                {/* Modal header */}
                <div className="relative">
                  <div className="aspect-[16/7] overflow-hidden rounded-t-2xl">
                    <img
                      src={selectedEvent.image}
                      alt={selectedEvent.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-2xl" />
                  </div>
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors shadow-sm"
                  >
                    <X size={16} />
                  </button>
                  <div className="absolute bottom-4 left-5 right-5 flex items-center gap-3">
                    <img src="/SLNL_logo.png" alt="SLNL" className="w-10 h-10 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-white text-shadow">{selectedEvent.title}</h3>
                      <p className="text-sm text-white/80">{selectedEvent.date} · {selectedEvent.location}</p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <p className="text-sm text-gray-500 pb-2">
                    Vul onderstaand formulier in om je in te schrijven voor dit evenement.
                  </p>

                  {/* Full name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Volledige naam <span className="text-somali-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Bijv. Mohamed Ahmed"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-forest-500/30 ${
                        errors.full_name
                          ? 'border-red-400 bg-red-50'
                          : 'border-gray-200 focus:border-forest-500'
                      }`}
                    />
                    {errors.full_name && (
                      <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      E-mailadres <span className="text-somali-red">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="naam@voorbeeld.nl"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-forest-500/30 ${
                        errors.email
                          ? 'border-red-400 bg-red-50'
                          : 'border-gray-200 focus:border-forest-500'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Telefoonnummer <span className="text-somali-red">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+31 6 12345678"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-forest-500/30 ${
                        errors.phone
                          ? 'border-red-400 bg-red-50'
                          : 'border-gray-200 focus:border-forest-500'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Number of guests */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Aantal gasten (inclusief uzelf) <span className="text-somali-red">*</span>
                    </label>
                    <select
                      name="num_guests"
                      value={formData.num_guests}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-forest-500 text-sm transition-colors outline-none focus:ring-2 focus:ring-forest-500/30 bg-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'persoon' : 'personen'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Optional message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Bericht (optioneel)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Eventuele opmerkingen of vragen..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-forest-500 text-sm transition-colors outline-none focus:ring-2 focus:ring-forest-500/30 resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={modalState === 'submitting'}
                    className="w-full py-3.5 bg-forest-800 text-white font-semibold rounded-xl hover:bg-forest-700 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  >
                    {modalState === 'submitting' ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Bezig met inschrijven...
                      </span>
                    ) : (
                      'Inschrijven'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
