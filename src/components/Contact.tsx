import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: info */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-forest-50 text-forest-700 text-xs font-bold uppercase tracking-widest rounded-full border border-forest-100 mb-4">
              Contact
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6">
              Neem contact met ons op
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Heb je vragen, wil je samenwerken of wil je meer informatie over onze activiteiten?
              Neem gerust contact met ons op. We reageren zo snel mogelijk.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-forest-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-forest-700" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Telefoon</div>
                  <a href="tel:+31687950151" className="text-forest-700 hover:underline text-sm">
                    (+31) 6 87950151
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-forest-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-forest-700" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">E-mail</div>
                  <a href="mailto:info@slnl.nl" className="text-forest-700 hover:underline text-sm">
                    info@slnl.nl
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-forest-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-forest-700" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Locatie</div>
                  <span className="text-gray-500 text-sm">Nederland (landelijk actief)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 border border-gray-100">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-8">
                <img src="/SLNL_logo.png" alt="SLNL" className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Bericht verstuurd!</h3>
                <p className="text-gray-500 text-sm">
                  Bedankt voor je bericht. We nemen zo snel mogelijk contact met je op.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-bold text-gray-900 text-lg mb-5">Stuur ons een bericht</h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Naam</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Jouw naam"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-forest-500 text-sm outline-none focus:ring-2 focus:ring-forest-500/30 bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-mail</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="jouw@email.nl"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-forest-500 text-sm outline-none focus:ring-2 focus:ring-forest-500/30 bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bericht</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Jouw bericht..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-forest-500 text-sm outline-none focus:ring-2 focus:ring-forest-500/30 bg-white transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="group w-full inline-flex items-center justify-center gap-2 py-3 bg-forest-800 text-white font-semibold rounded-xl hover:bg-forest-700 active:scale-95 transition-all duration-200"
                >
                  Verstuur Bericht
                  <Send size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
