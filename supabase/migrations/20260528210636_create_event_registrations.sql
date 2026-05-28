/*
  # Create event registrations table

  1. New Tables
    - `event_registrations`
      - `id` (uuid, primary key)
      - `event_id` (text, identifier of the event)
      - `event_name` (text, human-readable event name)
      - `full_name` (text, registrant's full name)
      - `email` (text, registrant's email)
      - `phone` (text, registrant's phone number)
      - `num_guests` (integer, number of guests including registrant)
      - `message` (text, optional message)
      - `created_at` (timestamptz, registration timestamp)

  2. Security
    - Enable RLS on `event_registrations` table
    - Allow anonymous users to insert registrations (public event sign-ups)
    - Only authenticated users (admins) can read all registrations
*/

CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL DEFAULT '',
  event_name text NOT NULL DEFAULT '',
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  num_guests integer NOT NULL DEFAULT 1,
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a registration"
  ON event_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    full_name <> '' AND
    email <> '' AND
    phone <> ''
  );

CREATE POLICY "Authenticated users can view registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (true);
