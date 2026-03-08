-- ==============================================================================
-- TRAVEL LOUNGE MAURITIUS: RLS & SCHEMA FIXES
-- Closes severe security vulnerabilities and integrity gaps
-- ==============================================================================

-- 1. Services Visibility Fix
-- Prevents draft/inactive services from being queried by the public API
DROP POLICY IF EXISTS "Public can view services" ON services;
CREATE POLICY "Public can view services" ON services FOR SELECT USING (is_active = true);

-- 2. Restrict Admin Actions (Services)
-- Currently any user with a valid JWT can edit services. 
-- We now cross-reference the JWT email with the internal `admins` table.
DROP POLICY IF EXISTS "Admins can manage services" ON services;
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt() ->> 'email')
);

-- 3. Restrict Admin Actions (Bookings)
DROP POLICY IF EXISTS "Admins can manage bookings" ON bookings;
CREATE POLICY "Admins can manage bookings" ON bookings FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt() ->> 'email')
);

-- 4. Secure Booking Creation 
-- Bookings are now inserted via the temp table trigger, which operates securely.
-- Dropping public access permanently.
DROP POLICY IF EXISTS "Public can create bookings" ON bookings;

-- 5. Data Integrity: Protect Services with existing Bookings
-- Prevents a service from being deleted if a booking references it, avoiding "orphan" bookings.
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_service_id_fkey;
ALTER TABLE bookings ADD CONSTRAINT bookings_service_id_fkey FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT;
