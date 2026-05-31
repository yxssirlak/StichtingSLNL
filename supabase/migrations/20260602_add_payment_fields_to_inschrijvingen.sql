-- Add payment fields to inschrijvingen table
ALTER TABLE IF EXISTS inschrijvingen
  ADD COLUMN IF NOT EXISTS payment_id text DEFAULT '',
  ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_amount numeric DEFAULT 0;

UPDATE inschrijvingen SET payment_amount = 0 WHERE payment_amount IS NULL;
