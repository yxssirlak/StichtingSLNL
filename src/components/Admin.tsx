import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Save, Lock, LogOut, Loader2, Upload, Users, PlusCircle, Search, Download, ImagePlus, X } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'toevoegen' | 'inschrijvingen' | 'galerij'>('toevoegen');

  // --- STATE EVENEMENT ---
  const [titel, setTitel] = useState('');
  const [datum, setDatum] = useState('');
  const [tijd, setTijd] = useState('');
  const [locatie, setLocatie] = useState('');
  const [type, setType] = useState('');
  const [beschrijving, setBeschrijving] = useState('');
  const [isHoofd, setIsHoofd] = useState(false);
  const [inschrijvenMogelijk, setInschrijvenMogelijk] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [melding, setMelding] = useState({ text: '', type: '' });

  // --- STATE INSCHRIJVINGEN ---
  const [inschrijvingen, setInschrijvingen] = useState<any[]>([]);
  const [loadingInschrijvingen, setLoadingInschrijvingen] = useState(false);
  const [zoekTerm, setZoekTerm] = useState('');
  const [filterEvenement, setFilterEvenement] = useState('');

  // --- STATE GALERIJ ---
  const [galTitel, setGalTitel] = useState('');
  const [galBeschrijving, setGalBeschrijving] = useState('');
  const [galFiles, setGalFiles] = useState<File[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    
    const opschonenDatabase = async () => {
      const vorigeWeek = new Date();
      vorigeWeek.setDate(vorigeWeek.getDate() - 7);
      const datumGrens = vorigeWeek.toISOString().split('T')[0];
      
      const { data: oudeEvenementen } = await supabase.from('evenementen').select('titel').lt('datum', datumGrens);

      if (oudeEvenementen && oudeEvenementen.length > 0) {
        const titels = oudeEvenementen.map(ev => ev.titel);
        await supabase.from('inschrijvingen').delete().in('evenement_titel', titels);
        await supabase.from('evenementen').delete().lt('datum', datumGrens);
      }
    };
    
    opschonenDatabase();
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (activeTab === 'inschrijvingen') fetchInschrijvingen();
  }, [activeTab]);

  const fetchInschrijvingen = async () => {
    setLoadingInschrijvingen(true);
    const { data, error } = await supabase.from('inschrijvingen').select('*').order('created_at', { ascending: false }); 
    if (data) setInschrijvingen(data);
    setLoadingInschrijvingen(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError('Inloggen mislukt.');
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMelding({ text: 'Bezig met verwerken...', type: 'info' });

    let finalImageUrl = '';
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('evenement-fotos').upload(fileName, imageFile);
      if (uploadError) {
        setMelding({ text: 'Foto upload mislukt: ' + uploadError.message, type: 'error' });
        setLoading(false); return;
      }
      const { data: { publicUrl } } = supabase.storage.from('evenement-fotos').getPublicUrl(fileName);
      finalImageUrl = publicUrl;
    }

    const { error } = await supabase.from('evenementen').insert([{
      titel, datum, tijd, locatie, type, beschrijving, is_hoofdevenement: isHoofd, afbeelding_url: finalImageUrl, inschrijven_mogelijk: inschrijvenMogelijk
    }]);

    if (error) {
      setMelding({ text: 'Fout bij opslaan: ' + error.message, type: 'error' });
    } else {
      setMelding({ text: 'Evenement succesvol opgeslagen!', type: 'success' });
      setTitel(''); setDatum(''); setTijd(''); setLocatie(''); setType(''); setBeschrijving(''); setIsHoofd(false); setInschrijvenMogelijk(false); setImageFile(null);
    }
    setLoading(false);
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (galFiles.length === 0) {
      setMelding({ text: 'Selecteer a.u.b. minimaal 1 foto.', type: 'error' });
      return;
    }
    setLoading(true);
    setMelding({ text: `Album uploaden (${galFiles.length} foto's)... even geduld a.u.b.`, type: 'info' });

    const uploadedUrls: string[] = [];

    for (const file of galFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `album-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('evenement-fotos').upload(fileName, file);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('evenement-fotos').getPublicUrl(fileName);
        uploadedUrls.push(publicUrl);
      }
    }

    const { error } = await supabase.from('galerij').insert([{
      titel: galTitel,
      beschrijving: galBeschrijving,
      afbeelding_urls: uploadedUrls
    }]);

    if (error) {
      setMelding({ text: 'Fout bij opslaan: ' + error.message, type: 'error' });
    } else {
      setMelding({ text: 'Album succesvol opgeslagen!', type: 'success' });
      setGalTitel(''); setGalBeschrijving(''); setGalFiles([]);
    }
    setLoading(false);
  };

  const uniekeEvenementen = Array.from(new Set(inschrijvingen.map(i => i.evenement_titel)));
  const gefilterdeInschrijvingen = inschrijvingen.filter(inschrijving => {
    const matchZoekterm = (inschrijving.naam?.toLowerCase().includes(zoekTerm.toLowerCase()) || false) || (inschrijving.email?.toLowerCase().includes(zoekTerm.toLowerCase()) || false);
    const matchEvenement = filterEvenement === '' || inschrijving.evenement_titel === filterEvenement;
    return matchZoekterm && matchEvenement;
  });

  const exporteerNaarCSV = () => {
    const headers = ['Datum Inschrijving', 'Naam', 'E-mailadres', 'Evenement'];
    const csvData = gefilterdeInschrijvingen.map(row => {
      const datum = row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Recent';
      return `"${datum}","${row.naam || ''}","${row.email || ''}","${row.evenement_titel || ''}"`;
    });
    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inschrijvingen_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden text-gray-900">
          <div className="bg-forest-800 px-8 py-6 text-white text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4"><Lock size={32} /></div>
            <h1 className="text-2xl font-black">Bestuur Login</h1>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {loginError && <div className="p-4 bg-red-50 text-red-700 text-sm font-bold rounded-xl">{loginError}</div>}
            <input type="email" placeholder="E-mailadres" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-forest-500" />
            <input type="password" placeholder="Wachtwoord" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-forest-500" />
            <button type="submit" disabled={loading} className="w-full py-4 bg-forest-800 text-white font-bold rounded-xl flex items-center justify-center">
              {loading ? <Loader2 className="animate-spin" /> : 'Inloggen'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] pt-32 pb-20 px-4 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 space-y-4">
          <div className="flex justify-start">
            <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors border border-gray-200 shadow-sm text-sm">
              <LogOut size={16}/> Uitloggen
            </button>
          </div>
          <div className="bg-white border border-gray-200 p-2 flex gap-2 rounded-2xl shadow-sm overflow-x-auto">
            <button onClick={() => setActiveTab('toevoegen')} className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'toevoegen' ? 'bg-forest-50 text-forest-800' : 'text-gray-500 hover:bg-gray-50'}`}>
              <PlusCircle size={18} /> Evenement
            </button>
            <button onClick={() => setActiveTab('galerij')} className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'galerij' ? 'bg-forest-50 text-forest-800' : 'text-gray-500 hover:bg-gray-50'}`}>
              <ImagePlus size={18} /> Nieuw Album
            </button>
            <button onClick={() => setActiveTab('inschrijvingen')} className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'inschrijvingen' ? 'bg-forest-50 text-forest-800' : 'text-gray-500 hover:bg-gray-50'}`}>
              <Users size={18} /> Inschrijvingen
            </button>
          </div>
        </div>

        {/* TAB 1: NIEUW EVENEMENT */}
        {activeTab === 'toevoegen' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {melding.text && <div className={`p-4 rounded-xl text-sm font-bold ${melding.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{melding.text}</div>}
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Titel van evenement</label><input type="text" value={titel} onChange={e => setTitel(e.target.value)} className="w-full p-3 rounded-xl border outline-none focus:border-forest-500" required /></div>
                <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Datum</label><input type="date" value={datum} onChange={e => setDatum(e.target.value)} className="w-full p-3 rounded-xl border outline-none focus:border-forest-500" required /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Tijd</label><input type="text" value={tijd} onChange={e => setTijd(e.target.value)} className="w-full p-3 rounded-xl border outline-none focus:border-forest-500" placeholder="14:00 - 22:00" required /></div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Type evenement</label>
                  <select value={type} onChange={e => setType(e.target.value)} className="w-full p-3 rounded-xl border bg-white outline-none focus:border-forest-500" required>
                    <option value="" disabled>Kies een type...</option>
                    <option value="Groot evenement">Groot evenement</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Jongeren">Jongeren</option>
                    <option value="Netwerkborrel">Netwerkborrel</option>
                    <option value="Lezing">Lezing</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Locatie</label><input type="text" value={locatie} onChange={e => setLocatie(e.target.value)} className="w-full p-3 rounded-xl border outline-none focus:border-forest-500" required /></div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Omslagfoto uploaden</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 relative cursor-pointer">
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <Upload className="mx-auto text-gray-400 mb-3" size={32} />
                  <p className="text-sm text-gray-700 font-medium">{imageFile ? `Geselecteerd: ${imageFile.name}` : 'Klik hier om te uploaden'}</p>
                </div>
              </div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Beschrijving</label><textarea value={beschrijving} onChange={e => setBeschrijving(e.target.value)} rows={5} className="w-full p-3 rounded-xl border outline-none focus:border-forest-500 resize-none" required /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-forest-50/50 rounded-xl border border-forest-100/60"><input type="checkbox" id="hoofd" checked={isHoofd} onChange={e => setIsHoofd(e.target.checked)} className="w-5 h-5 accent-forest-800 rounded cursor-pointer" /><label htmlFor="hoofd" className="text-sm font-bold text-forest-900 cursor-pointer">Dit is een hoofdevenement</label></div>
                <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100/60"><input type="checkbox" id="inschrijven" checked={inschrijvenMogelijk} onChange={e => setInschrijvenMogelijk(e.target.checked)} className="w-5 h-5 accent-blue-600 rounded cursor-pointer" /><label htmlFor="inschrijven" className="text-sm font-bold text-blue-900 cursor-pointer">Bezoekers moeten zich inschrijven</label></div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 bg-forest-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-forest-700"><Loader2 className={loading ? "animate-spin" : "hidden"} size={20} /> <Save className={loading ? "hidden" : "block"} size={20} /> Evenement Opslaan</button>
            </form>
          </div>
        )}

        {/* TAB 2: GALERIJ ALBUM TOEVOEGEN */}
        {activeTab === 'galerij' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-fade-in">
            {melding.text && <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${melding.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{melding.text}</div>}
            
            <h2 className="text-2xl font-black mb-6">Nieuw Foto-album toevoegen</h2>
            
            <form onSubmit={handleGallerySubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Titel van het album</label>
                <input type="text" value={galTitel} onChange={e => setGalTitel(e.target.value)} className="w-full p-3 rounded-xl border outline-none focus:border-forest-500" placeholder="Bijv. Jaarlijkse BBQ 2024" required />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Korte beschrijving</label>
                <textarea value={galBeschrijving} onChange={e => setGalBeschrijving(e.target.value)} rows={3} className="w-full p-3 rounded-xl border outline-none focus:border-forest-500" placeholder="Wat was er zo speciaal aan deze dag?" required />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Foto's selecteren (Je kunt meerdere tegelijk aanklikken)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 hover:border-forest-500 transition-colors relative cursor-pointer">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={e => {
                      const newFiles = Array.from(e.target.files || []);
                      // Voeg de nieuwe foto's toe aan de lijst die je al had
                      setGalFiles(prev => [...prev, ...newFiles]);
                    }} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-600 font-medium">Klik hier of sleep foto's om toe te voegen</p>
                </div>

                {/* --- FOTO PREVIEWS --- */}
                {galFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {galFiles.map((file, index) => (
                      <div key={index} className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200 group">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`preview-${index}`} 
                          className="w-full h-full object-cover" 
                        />
                        <button 
                          type="button" 
                          onClick={(e) => {
                            e.preventDefault();
                            setGalFiles(prev => prev.filter((_, i) => i !== index));
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* --------------------- */}

              </div>
              
              <button type="submit" disabled={loading} className="w-full py-4 bg-forest-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-forest-700 transition-all">
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} Album Publiceren
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: INSCHRIJVINGEN OVERZICHT */}
        {activeTab === 'inschrijvingen' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-1">
                <div className="relative w-full sm:max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input type="text" placeholder="Zoek naam of e-mail..." value={zoekTerm} onChange={(e) => setZoekTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-forest-500 text-sm" /></div>
                <select value={filterEvenement} onChange={(e) => setFilterEvenement(e.target.value)} className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-200 bg-white outline-none focus:border-forest-500 text-sm"><option value="">Alle evenementen</option>{uniekeEvenementen.map((ev, i) => (<option key={i} value={ev as string}>{ev as string}</option>))}</select>
              </div>
              <button onClick={exporteerNaarCSV} disabled={gefilterdeInschrijvingen.length === 0} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-forest-800 text-white text-sm font-bold rounded-lg hover:bg-forest-700 transition-colors disabled:opacity-50"><Download size={16} /> Excel Export</button>
            </div>
            {loadingInschrijvingen ? (<div className="p-12 flex flex-col items-center justify-center text-gray-500"><Loader2 className="animate-spin mb-2" size={32} /><p>Inschrijvingen laden...</p></div>) : gefilterdeInschrijvingen.length === 0 ? (<div className="p-12 text-center text-gray-500"><Users size={48} className="mx-auto mb-4 text-gray-300" /><h3 className="text-xl font-bold text-gray-800 mb-2">Geen inschrijvingen</h3></div>) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="bg-white border-b border-gray-200"><th className="p-4 font-bold text-gray-600 text-sm">Datum</th><th className="p-4 font-bold text-gray-600 text-sm">Naam</th><th className="p-4 font-bold text-gray-600 text-sm">E-mailadres</th><th className="p-4 font-bold text-gray-600 text-sm">Evenement</th></tr></thead>
                  <tbody>
                    {gefilterdeInschrijvingen.map((inschrijving, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"><td className="p-4 text-sm text-gray-500">{inschrijving.created_at ? new Date(inschrijving.created_at).toLocaleDateString() : 'Recent'}</td><td className="p-4 font-bold text-gray-900">{inschrijving.naam}</td><td className="p-4 text-sm text-gray-600"><a href={`mailto:${inschrijving.email}`} className="text-forest-600 hover:underline">{inschrijving.email}</a></td><td className="p-4"><span className="px-3 py-1 bg-blue-50 text-blue-800 text-xs font-bold rounded-full">{inschrijving.evenement_titel}</span></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}