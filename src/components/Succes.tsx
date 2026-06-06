import { CheckCircle, ArrowRight, CalendarDays } from 'lucide-react';

export default function Succes() {
  return (
    <div className="min-h-screen bg-[#F8FAF9] pt-32 pb-20 flex items-center justify-center px-4 animate-fade-in">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl overflow-hidden text-center border border-[#E2F0E9]">
        
        {/* Groene header sectie */}
        <div className="bg-[#114232] py-10 px-8 flex flex-col items-center">
          <div className="bg-white rounded-full p-3 mb-6">
            <CheckCircle size={48} className="text-[#114232]" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Bedankt voor je inschrijving!
          </h1>
          <p className="text-[#E2F0E9] text-lg">
            We hebben je verzoek in goede orde ontvangen.
          </p>
        </div>

        {/* Content sectie */}
        <div className="p-10">
          <p className="text-gray-600 mb-8 leading-relaxed">
            Als je betaling via Mollie succesvol is afgerond, is je ticket definitief gereserveerd. Je ontvangt hiervan zo snel mogelijk een bevestiging.
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 flex items-center gap-4 text-left">
            <CalendarDays className="text-[#114232] shrink-0" size={32} />
            <div>
              <h3 className="font-bold text-gray-900">We kijken ernaar uit je te zien!</h3>
              <p className="text-sm text-gray-500">Houd onze evenementenpagina in de gaten voor updates.</p>
            </div>
          </div>

          <a 
            href="/evenementen" 
            className="inline-flex w-full items-center justify-center gap-2 px-8 py-4 bg-[#114232] text-white font-bold rounded-xl hover:bg-opacity-90 transition"
          >
            Terug naar Evenementen <ArrowRight size={20} />
          </a>
        </div>
        
      </div>
    </div>
  );
}