import { useState } from 'react';
import { Scanner as QRScanner } from '@yudiel/react-qr-scanner';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, AlertTriangle, RefreshCcw, User, CreditCard } from 'lucide-react';

export default function Scanner() {
  const [scanStatus, setScanStatus] = useState<'idle' | 'processing' | 'success' | 'used' | 'invalid'>('idle');
  const [bezoeker, setBezoeker] = useState<any>(null);

  const processQR = async (result: string) => {
    // Voorkom dubbel scannen als hij al bezig is
    if (scanStatus !== 'idle') return;
    setScanStatus('processing');

    try {
      // 1. Zoek het ticket in de database op basis van de QR code (paymentId)
      const { data, error } = await supabase
        .from('inschrijvingen')
        .select('*')
        .eq('payment_id', result)
        .single();

      if (error || !data) {
        setScanStatus('invalid');
        return;
      }

      setBezoeker(data);

      // 2. Check of hij wel betaald heeft
      if (data.payment_status !== 'paid') {
        setScanStatus('invalid');
        return;
      }

      // 3. Check of het ticket al eerder is gescand
      if (data.is_gescand) {
        setScanStatus('used');
        return;
      }

      // 4. Alles is goed! Zet het ticket op 'gescand' in de database
      const { error: updateError } = await supabase
        .from('inschrijvingen')
        .update({ is_gescand: true })
        .eq('payment_id', result);

      if (updateError) throw updateError;

      setScanStatus('success');

    } catch (error) {
      console.error('Fout bij scannen:', error);
      setScanStatus('invalid');
    }
  };

  const resetScanner = () => {
    setScanStatus('idle');
    setBezoeker(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10 px-4 flex flex-col items-center animate-fade-in">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-800">
        <div className="bg-forest-900 py-6 px-6 text-center text-white">
          <h1 className="text-2xl font-black mb-1">Ticket Scanner</h1>
          <p className="text-slate-200 text-sm">Houd de QR-code rustig binnen het kader. Zorg dat de camera scherp is.</p>
        </div>

        <div className="relative bg-slate-950 min-h-[360px] flex flex-col items-center justify-between p-4">
          <div className="w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden border border-forest-700 shadow-inner">
            {scanStatus === 'idle' || scanStatus === 'processing' ? (
              <div className="w-full h-full bg-slate-950 relative">
                <QRScanner
                  onScan={(result) => {
                    if (result && result.length > 0) {
                      processQR(result[0].rawValue);
                    }
                  }}
                  onError={(error) => console.log(error)}
                  styles={{ container: { width: '100%', height: '100%' } }}
                />
                {scanStatus === 'processing' && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-white font-bold animate-pulse text-lg">Ticket controleren...</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-white">
                {scanStatus === 'success' && (
                  <div className="animate-bounce-in">
                    <CheckCircle size={80} className="text-green-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Geldig Ticket!</h2>
                    <p className="text-green-600 font-bold mb-6">Toegang verleend</p>
                  </div>
                )}

                {scanStatus === 'used' && (
                  <div className="animate-fade-in">
                    <AlertTriangle size={80} className="text-orange-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Al Gescand!</h2>
                    <p className="text-orange-600 font-bold mb-6">Let op: dit ticket is al binnen.</p>
                  </div>
                )}

                {scanStatus === 'invalid' && (
                  <div className="animate-fade-in">
                    <XCircle size={80} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Ongeldig</h2>
                    <p className="text-red-600 font-bold mb-6">Ticket niet gevonden of niet betaald.</p>
                  </div>
                )}

                {bezoeker && (
                  <div className="bg-gray-50 rounded-xl p-4 w-full text-left mb-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <User size={18} className="text-gray-400" />
                      <span className="font-bold text-gray-900">{bezoeker.naam}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CreditCard size={18} className="text-gray-400" />
                      <span>{bezoeker.evenement_titel}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={resetScanner}
                  className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition"
                >
                  <RefreshCcw size={18} /> Scan Volgende
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}