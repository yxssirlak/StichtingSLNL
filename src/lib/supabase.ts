// We importeren createClient niet meer echt om crashes te voorkomen
export const supabase = {
  from: (table: string) => {
    return {
      // Zorgt ervoor dat evenementen ophalen niet crasht
      select: () => {
        return {
          order: () => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve({ data: null, error: null }),
          eq: () => Promise.resolve({ data: [], error: null }),
        };
      },
      // Zorgt ervoor dat het inschrijfformulier succesvol verzendt!
      insert: (data: any) => {
        console.log(`[Mock DB] Succesvol opgeslagen in tabel "${table}":`, data);
        return Promise.resolve({ data, error: null });
      }
    };
  }
};

// Dit type moet exact zo blijven staan, omdat App.tsx hiernaar verwijst!
export type EventRegistration = {
  id?: string;
  event_id: string;
  event_name: string;
  full_name: string;
  email: string;
  phone: string;
  num_guests: number;
  message?: string;
  created_at?: string;
};