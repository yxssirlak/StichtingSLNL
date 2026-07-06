import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Download, Loader2, Image as ImageIcon, CheckCircle2, X, List } from 'lucide-react';

export default function Gallerij() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  useEffect(() => {
    fetchAlbums();
  }, []);

  async function fetchAlbums() {
    const { data, error } = await supabase.from('galerij').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error("Fout bij ophalen galerij:", error);
    }
    if (data) setAlbums(data);
    setLoading(false);
  }

  const togglePhotoSelection = (url: string) => {
    setSelectedPhotos(prev => 
      prev.includes(url) 
        ? prev.filter(photoUrl => photoUrl !== url) 
        : [...prev, url]
    );
  };

  const selectAllFromAlbum = (albumUrls: string[]) => {
    setSelectedPhotos(prev => {
      const newSelection = [...prev];
      albumUrls.forEach(url => {
        if (!newSelection.includes(url)) newSelection.push(url);
      });
      return newSelection;
    });
  };

  // Functie om soepel naar het juiste album te scrollen
  const scrollToAlbum = (id: string) => {
    const element = document.getElementById(`album-${id}`);
    if (element) {
      // 120px offset toegevoegd zodat de navigatiebalk het album niet overlapt
      const y = element.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleDownload = async () => {
    if (selectedPhotos.length === 0) return;
    setIsDownloading(true);

    let albumTitle = "SLNL-Evenement";
    for (const album of albums) {
      let urls = [];
      try {
        urls = typeof album.afbeelding_urls === 'string' ? JSON.parse(album.afbeelding_urls || "[]") : (album.afbeelding_urls || []);
      } catch (e) {}
      
      if (urls.includes(selectedPhotos[0])) {
        albumTitle = album.titel.replace(/\s+/g, '-');
        break;
      }
    }

    for (let i = 0; i < selectedPhotos.length; i++) {
      try {
        const response = await fetch(selectedPhotos[i]);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        
        link.download = `${albumTitle}-selectie-${i + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (err) {
        console.error("Fout bij downloaden foto:", err);
      }
    }
    
    setIsDownloading(false);
    setSelectedPhotos([]); 
  };

  if (loading) return ( <div className="min-h-screen flex items-center justify-center text-[#114232]"><Loader2 className="animate-spin" size={32} /></div> );

  return (
    <div className="min-h-screen bg-[#F8FAF9] pt-32 pb-32 px-4 relative">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-4xl font-black text-center mb-4 text-gray-900">Terugblik</h1>
        <p className="text-center text-gray-600 mb-12">Bekijk onze mooiste herinneringen van de afgelopen evenementen.</p>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* ZIJBALK (Navigatie) */}
          {albums.length > 0 && (
            <div className="hidden lg:block w-72 shrink-0 sticky top-32 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm z-10">
              <div className="flex items-center gap-2 mb-6 text-gray-900">
                <List size={20} className="text-[#114232]" />
                <h3 className="font-black text-lg">Alle Albums</h3>
              </div>
              <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {albums.map(album => (
                  <li key={`nav-${album.id}`}>
                    <button 
                      onClick={() => scrollToAlbum(album.id)} 
                      className="text-left w-full px-4 py-3 rounded-xl hover:bg-[#114232]/5 text-gray-600 hover:text-[#114232] transition-colors text-sm font-bold truncate"
                    >
                      {album.titel}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* HOOFDCONTENT (Albums) */}
          <div className="flex-1 w-full">
            {albums.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <ImageIcon className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500 font-bold">Er zijn nog geen albums geüpload.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {albums.map((album) => {
                  let urls = [];
                  if (Array.isArray(album.afbeelding_urls)) {
                    urls = album.afbeelding_urls;
                  } else if (typeof album.afbeelding_urls === 'string') {
                    try { urls = JSON.parse(album.afbeelding_urls); } catch (e) {}
                  }
                  
                  return (
                    <div 
                      key={album.id} 
                      id={`album-${album.id}`} 
                      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-32"
                    >
                      <div className="mb-8">
                        <h2 className="text-2xl font-black text-gray-900 mb-2">{album.titel}</h2>
                        <p className="text-gray-600 mb-4">{album.beschrijving}</p>
                        
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="inline-flex items-center gap-2 bg-[#114232]/10 text-[#114232] px-4 py-2 rounded-xl text-sm font-bold border border-[#114232]/20">
                            <CheckCircle2 size={18} />
                            Selecteer de foto's die je wilt downloaden
                          </div>
                          <button 
                            onClick={() => selectAllFromAlbum(urls)}
                            className="text-sm font-medium text-gray-500 hover:text-[#114232] transition-colors underline underline-offset-2"
                          >
                            Of selecteer hele album
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {urls.map((url: string, index: number) => {
                          const isSelected = selectedPhotos.includes(url);
                          
                          return (
                            <div 
                              key={index} 
                              onClick={() => togglePhotoSelection(url)}
                              className={`relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group cursor-pointer transition-all duration-300 ${
                                isSelected 
                                  ? 'ring-4 ring-[#114232] shadow-[0_0_15px_rgba(17,66,50,0.3)] scale-[0.98]' 
                                  : 'hover:opacity-90'
                              }`}
                            >
                              <img 
                                src={url} 
                                alt={`Foto ${index + 1}`} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy" 
                              />
                              
                              {isSelected && (
                                <div className="absolute inset-0 bg-[#114232]/20 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300">
                                  <CheckCircle2 className="text-white drop-shadow-md" size={40} strokeWidth={2.5} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedPhotos.length > 0 && (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50">
          <div className="bg-white rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-gray-100 p-2 flex items-center gap-2 transform transition-all">
            <button
              onClick={() => setSelectedPhotos([])}
              className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Selectie wissen"
            >
              <X size={20} />
            </button>
            
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 px-6 py-3 bg-[#114232] text-white font-bold rounded-full hover:bg-[#0a2e22] transition-colors disabled:opacity-70 min-w-[200px] justify-center shadow-md"
            >
              {isDownloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
              {isDownloading ? 'Bezig...' : `Download ${selectedPhotos.length} ${selectedPhotos.length === 1 ? 'foto' : 'foto\'s'}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}