-- Add columns for paid events
ALTER TABLE IF EXISTS evenementen
  ADD COLUMN IF NOT EXISTS betaald_evenement boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS betaal_bedrag numeric DEFAULT 0;

-- Optional: set betaal_bedrag to 0 for existing nulls
UPDATE evenementen SET betaal_bedrag = 0 WHERE betaal_bedrag IS NULL;
