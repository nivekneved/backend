-- ==============================================================================
-- TRAVEL LOUNGE MAURITIUS: INFRASTRUCTURE (DDL)
-- Consolidated Schema
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. UTILITY FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 2. TABLE DEFINITIONS
-- =====================================================

-- 2.1 ADMINS
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  slug VARCHAR(255) UNIQUE,
  icon VARCHAR(50),
  image_url TEXT,
  link VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  show_on_home BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2.3 SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(255) PRIMARY KEY,
  value JSONB,
  category VARCHAR(100),
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2.4 MEDIA
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255),
  url TEXT,
  type VARCHAR(50),
  size_bytes INTEGER,
  folder VARCHAR(255) DEFAULT 'general',
  alt_text VARCHAR(255),
  used_in JSONB DEFAULT '[]',
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- 2.5 TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR(255),
  avatar_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2.6 TEAM MEMBERS
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  role VARCHAR(255),
  photo_url TEXT,
  bio TEXT,
  email VARCHAR(255),
  linkedin_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2.7 HERO SLIDES
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  subtitle VARCHAR(255),
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  media_type VARCHAR(10) DEFAULT 'image', -- 'image' or 'video'
  cta_text VARCHAR(50),
  cta_link VARCHAR(255),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2.8 MENUS
CREATE TABLE IF NOT EXISTS menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(100),
  location VARCHAR(50),
  items JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2.9 PROMOTIONS
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  description TEXT,
  image TEXT,
  link VARCHAR(255),
  valid_until TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2.10 FLIGHTS
CREATE TABLE IF NOT EXISTS flights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  airline VARCHAR(255),
  flight_number VARCHAR(100),
  departure_city VARCHAR(255),
  arrival_city VARCHAR(255),
  departure_time TIMESTAMP,
  arrival_time TIMESTAMP,
  price DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'active',
  logo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2.11 NEWSLETTER SUBSCRIBERS
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2.12 EMAIL TEMPLATES
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    body TEXT, -- HTML content
    variables JSONB DEFAULT '[]', -- standard variables like {{name}}, {{date}}
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2.13 PAGES
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE,
  title VARCHAR(255),
  content JSONB,
  meta_title VARCHAR(255),
  meta_description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2.14 AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES admins(id),
    action TEXT NOT NULL,
    target_type TEXT,
    target_id TEXT,
    details TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.15 SERVICES (Unified Table for Hotels, Activities, Cruises, etc.)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  category VARCHAR(50), -- 'hotels', 'activities', 'cruises', etc.
  type VARCHAR(50), -- Specific type
  description TEXT,
  location VARCHAR(255),
  pricing JSONB,
  images TEXT[],
  is_featured BOOLEAN DEFAULT false,
  -- Extended fields
  duration TEXT,
  ports TEXT, -- For cruises
  highlights JSONB,
  amenities JSONB,
  itinerary JSONB DEFAULT '[]',
  inclusions JSONB DEFAULT '[]',
  rating NUMERIC,
  star_rating INTEGER,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ensure all columns exist (idempotent updates for existing table)
DO $$ 
BEGIN
    ALTER TABLE services ADD COLUMN IF NOT EXISTS name VARCHAR(255);
    ALTER TABLE services ADD COLUMN IF NOT EXISTS category VARCHAR(50);
    ALTER TABLE services ADD COLUMN IF NOT EXISTS type VARCHAR(50);
    ALTER TABLE services ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE services ADD COLUMN IF NOT EXISTS location VARCHAR(255);
    ALTER TABLE services ADD COLUMN IF NOT EXISTS pricing JSONB;
    ALTER TABLE services ADD COLUMN IF NOT EXISTS images TEXT[];
    ALTER TABLE services ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
    ALTER TABLE services ADD COLUMN IF NOT EXISTS duration TEXT;
    ALTER TABLE services ADD COLUMN IF NOT EXISTS ports TEXT;
    ALTER TABLE services ADD COLUMN IF NOT EXISTS highlights JSONB;
    ALTER TABLE services ADD COLUMN IF NOT EXISTS amenities JSONB;
    ALTER TABLE services ADD COLUMN IF NOT EXISTS itinerary JSONB DEFAULT '[]';
    ALTER TABLE services ADD COLUMN IF NOT EXISTS inclusions JSONB DEFAULT '[]';
    ALTER TABLE services ADD COLUMN IF NOT EXISTS rating NUMERIC;
    ALTER TABLE services ADD COLUMN IF NOT EXISTS star_rating INTEGER;
    ALTER TABLE services ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
    ALTER TABLE services ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    ALTER TABLE services ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
    ALTER TABLE services ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
END $$;

-- 2.16 HOTEL ROOMS
CREATE TABLE IF NOT EXISTS hotel_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  name VARCHAR(255),
  size VARCHAR(50),
  bed VARCHAR(100),
  view VARCHAR(100),
  price_per_night DECIMAL(10, 2),
  image_url TEXT,
  features JSONB,
  policies JSONB DEFAULT '[]',
  cancellation_policy TEXT,
  deposit_policy TEXT,
  type VARCHAR(50),
  total_units INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2.17 ROOM DAILY PRICES (Inventory/Pricing Calendar)
CREATE TABLE IF NOT EXISTS room_daily_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES hotel_rooms(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  price DECIMAL(10, 2),
  is_blocked BOOLEAN DEFAULT false,
  available_units INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(room_id, date)
);

-- 2.18 REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR(255),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.19 BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_info JSONB,
  service_id UUID REFERENCES services(id),
  service_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  booking_details JSONB,
  total_price DECIMAL(10, 2),
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 3. INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(display_order);

CREATE INDEX IF NOT EXISTS idx_media_folder ON media(folder);
CREATE INDEX IF NOT EXISTS idx_media_type ON media(type);
CREATE INDEX IF NOT EXISTS idx_media_uploaded ON media(uploaded_at DESC);

CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials(display_order);

CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(is_featured);

CREATE INDEX IF NOT EXISTS idx_room_daily_prices_date ON room_daily_prices(date);
CREATE INDEX IF NOT EXISTS idx_room_daily_prices_room ON room_daily_prices(room_id);

-- =====================================================
-- 4. TRIGGERS (Updated At)
-- =====================================================

DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_updated_at ON team_members;
CREATE TRIGGER update_team_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hero_slides_updated_at ON hero_slides;
CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON hero_slides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_menus_updated_at ON menus;
CREATE TRIGGER update_menus_updated_at BEFORE UPDATE ON menus FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_flights_updated_at ON flights;
CREATE TRIGGER update_flights_updated_at BEFORE UPDATE ON flights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_email_templates_updated_at ON email_templates;
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hotel_rooms_updated_at ON hotel_rooms;
CREATE TRIGGER update_hotel_rooms_updated_at BEFORE UPDATE ON hotel_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_room_daily_prices_updated_at ON room_daily_prices;
CREATE TRIGGER update_room_daily_prices_updated_at BEFORE UPDATE ON room_daily_prices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- CATEGORIES
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view active categories" ON categories;
CREATE POLICY "Public can view active categories" ON categories FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON categories;
CREATE POLICY "Authenticated users can manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');

-- SITE SETTINGS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view site settings" ON site_settings;
CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage settings" ON site_settings;
CREATE POLICY "Authenticated users can manage settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- MEDIA
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view media" ON media;
CREATE POLICY "Public can view media" ON media FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage media" ON media;
CREATE POLICY "Authenticated users can manage media" ON media FOR ALL USING (auth.role() = 'authenticated');

-- TESTIMONIALS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view approved testimonials" ON testimonials;
CREATE POLICY "Public can view approved testimonials" ON testimonials FOR SELECT USING (is_approved = true);
DROP POLICY IF EXISTS "Authenticated users can manage testimonials" ON testimonials;
CREATE POLICY "Authenticated users can manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');

-- REVIEWS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON reviews;
CREATE POLICY "Enable read access for all users" ON reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for all users" ON reviews;
CREATE POLICY "Enable insert for all users" ON reviews FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON reviews;
CREATE POLICY "Enable update for authenticated users only" ON reviews FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON reviews;
CREATE POLICY "Enable delete for authenticated users only" ON reviews FOR DELETE USING (auth.role() = 'authenticated');

-- TEAM MEMBERS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view team" ON team_members;
CREATE POLICY "Public can view team" ON team_members FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admins can manage team" ON team_members;
CREATE POLICY "Admins can manage team" ON team_members FOR ALL USING (auth.role() = 'authenticated');

-- HERO SLIDES
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view active slides" ON hero_slides;
CREATE POLICY "Public can view active slides" ON hero_slides FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admins can manage slides" ON hero_slides;
CREATE POLICY "Admins can manage slides" ON hero_slides FOR ALL USING (auth.role() = 'authenticated');

-- MENUS
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view menus" ON menus;
CREATE POLICY "Public can view menus" ON menus FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage menus" ON menus;
CREATE POLICY "Admins can manage menus" ON menus FOR ALL USING (auth.role() = 'authenticated');

-- PROMOTIONS
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view active promotions" ON promotions;
CREATE POLICY "Public can view active promotions" ON promotions FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admins can manage promotions" ON promotions;
CREATE POLICY "Admins can manage promotions" ON promotions FOR ALL USING (auth.role() = 'authenticated');

-- FLIGHTS
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view active flights" ON flights;
CREATE POLICY "Public can view active flights" ON flights FOR SELECT USING (status = 'active');
DROP POLICY IF EXISTS "Admins can manage flights" ON flights;
CREATE POLICY "Admins can manage flights" ON flights FOR ALL USING (auth.role() = 'authenticated');

-- NEWSLETTER
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage newsletter" ON newsletter_subscribers;
CREATE POLICY "Admins can manage newsletter" ON newsletter_subscribers FOR ALL USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Public can subscribe" ON newsletter_subscribers;
CREATE POLICY "Public can subscribe" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- EMAIL TEMPLATES
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage email templates" ON email_templates;
CREATE POLICY "Admins can manage email templates" ON email_templates FOR ALL USING (auth.role() = 'authenticated');

-- PAGES
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view pages" ON pages;
CREATE POLICY "Public can view pages" ON pages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage pages" ON pages;
CREATE POLICY "Admins can manage pages" ON pages FOR ALL USING (auth.role() = 'authenticated');

-- SERVICES
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view services" ON services;
CREATE POLICY "Public can view services" ON services FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage services" ON services;
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (auth.role() = 'authenticated');

-- HOTEL ROOMS
ALTER TABLE hotel_rooms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view hotel rooms" ON hotel_rooms;
CREATE POLICY "Public can view hotel rooms" ON hotel_rooms FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage hotel rooms" ON hotel_rooms;
CREATE POLICY "Admins can manage hotel rooms" ON hotel_rooms FOR ALL USING (auth.role() = 'authenticated');

-- ROOM DAILY PRICES
ALTER TABLE room_daily_prices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view daily prices" ON room_daily_prices;
CREATE POLICY "Public can view daily prices" ON room_daily_prices FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage daily prices" ON room_daily_prices;
CREATE POLICY "Admins can manage daily prices" ON room_daily_prices FOR ALL USING (auth.role() = 'authenticated');

-- BOOKINGS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (
  (auth.role() = 'authenticated' AND (customer_info->>'user_id' = auth.uid()::text)) 
  OR 
  (auth.role() = 'service_role')
); 
DROP POLICY IF EXISTS "Public can create bookings" ON bookings;
CREATE POLICY "Public can create bookings" ON bookings FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can manage bookings" ON bookings;
CREATE POLICY "Admins can manage bookings" ON bookings FOR ALL USING (auth.role() = 'authenticated');
