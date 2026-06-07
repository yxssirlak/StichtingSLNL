import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Download, Loader2, Image as ImageIcon } from 'lucide-react';

export default function Gallerij() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingAlbum, setDownloadingAlbum] = useState<string | null>(null);

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

  const downloadHeleAlbum = async (album: any) => {
    setDownloadingAlbum(album.id);
    
    // Veilige check om de array goed in te laden
    let urls = [];
    if (Array.isArray(album.afbeelding_urls)) {
      urls = album.afbeelding_urls;
    } else if (typeof album.afbeelding_urls === 'string') {
      try { urls = JSON.parse(album.afbeelding_urls); } catch (e) {}
    }
    
    for (let i = 0; i < urls.length; i++) {
      try {
        const response = await fetch(urls[i]);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${album.titel.replace(/\s+/g, '-')}-foto-${i + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (err) {
        console.error("Fout bij downloaden foto:", err);
      }
    }
    setDownloadingAlbum(null);
  };

  if (loading) return ( <div className="min-h-screen flex items-center justify-center text-forest-800"><Loader2 className="animate-spin" size={32} /></div> );

  return (
    <div className="min-h-screen bg-[#F8FAF9] pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-center mb-4 text-gray-900">Terugblik</h1>
        <p className="text-center text-gray-600 mb-12">Bekijk onze mooiste herinneringen van de afgelopen evenementen.</p>

        {albums.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <ImageIcon className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-bold">Er zijn nog geen albums geüpload.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {albums.map((album) => {
              // Zorgvuldige check voor weergave
              let urls = [];
              if (Array.isArray(album.afbeelding_urls)) {
                urls = album.afbeelding_urls;
              } else if (typeof album.afbeelding_urls === 'string') {
                try { urls = JSON.parse(album.afbeelding_urls); } catch (e) {}
              }
              
              return (
                <div key={album.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 mb-2">{album.titel}</h2>
                      <p className="text-gray-600">{album.beschrijving}</p>
                    </div>
                    
                    <button 
                      onClick={() => downloadHeleAlbum(album)}
                      disabled={downloadingAlbum === album.id || urls.length === 0}
                      className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-forest-50 text-forest-800 font-bold rounded-xl hover:bg-forest-100 transition-colors disabled:opacity-50"
                    >
                      {downloadingAlbum === album.id ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                      {downloadingAlbum === album.id ? 'Bezig met downloaden...' : 'Download Album'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {urls.map((url: string, index: number) => (
                      <div key={index} className="aspect-square rounded-2xl overflow-hidden bg-gray-100 group cursor-pointer">
                        <img 
                          src={url} 
                          alt={`Foto ${index + 1}`} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}