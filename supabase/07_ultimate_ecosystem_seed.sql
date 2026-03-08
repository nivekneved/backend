-- ==============================================================================
-- TRAVEL LOUNGE MAURITIUS: ULTIMATE ECOSYSTEM SEED (2026-03-06)
-- Comprehensive, high-fidelity, production-ready data for all 21 tables.
-- ==============================================================================

-- 0. CLEANUP (Idempotent TRUNCATE)
TRUNCATE TABLE 
  categories,
  site_settings,
  media,
  testimonials,
  team_members,
  hero_slides,
  menus,
  promotions,
  flights,
  newsletter_subscribers,
  email_templates,
  pages,
  page_content,
  services,
  hotel_rooms,
  room_daily_prices,
  reviews,
  bookings,
  seo_metadata
  RESTART IDENTITY CASCADE;

-- =====================================================
-- 1. SYSTEM CONFIGURATION & SEO
-- =====================================================

INSERT INTO site_settings (key, value, category, description) VALUES
('contact_phone', '"230 208 9999"', 'footer', 'Main contact phone number'),
('contact_email', '"info@travellounge.mu"', 'footer', 'Main contact email'),
('contact_address', '"Ground Floor Newton Tower, Sir William Newton St, Port Louis, Mauritius"', 'footer', 'Main office address'),
('working_hours', '"Mon-Fri: 9:00 AM - 5:00 PM | Sat: 9:00 AM - 12:00 PM"', 'footer', 'Business hours'),
('facebook_url', '"https://facebook.com/travellounge"', 'footer', 'Facebook page URL'),
('instagram_url', '"https://instagram.com/travellounge"', 'footer', 'Instagram profile URL'),
('website_url', '"https://travellounge.mu"', 'footer', 'Website URL'),
('site_title', '"Travel Lounge | Premium Mauritius Travel Agency"', 'seo', 'Global site title suffix'),
('site_description', '"Discover Mauritius and the world with Travel Lounge. Expert ticketing, bespoke tours, luxury hotels, and personalized travel experiences."', 'seo', 'Global site description'),
('office_locations', '[{"city": "Port Louis", "address": "Newton Tower", "phone": "230 208 9999"}, {"city": "Cybercity", "address": "Ebene", "phone": "230 468 9999"}]'::jsonb, 'footer', 'Array of office locations');

INSERT INTO seo_metadata (page_path, title, description, keywords) VALUES
('/', 'Home | Travel Lounge Mauritius', 'Discover premium travel experiences, luxury hotels, and global flight deals with Mauritius'' leading travel partner.', 'travel, mauritius, luxury, flights, cruises, hotels'),
('/hotels', 'Luxury Hotels in Mauritius | Travel Lounge', 'Book the finest resorts and villas in Mauritius at exclusive rates.', 'mauritius hotels, luxury resorts, beach villas'),
('/flights', 'Global Flight Deals | Travel Lounge', 'Exclusive airfares and IATA-certified ticketing services for over 100 destinations.', 'flights, cheap airfare, mauritius airlines'),
('/cruises', 'Cruise Vacations 2026 | Travel Lounge', 'Embark on magical grand voyages across the Mediterranean, Caribbean, and beyond.', 'cruises, Mediterranean, luxury ships'),
('/about', 'About Us | Travel Lounge Mauritius', 'Over 15 years of excellence in crafting personalized travel memories.', 'travel lounge story, travel experts mauritius');

-- =====================================================
-- 2. BRANDING & UI ELEMENTS
-- =====================================================

INSERT INTO categories (name, slug, icon, link, image_url, display_order, show_on_home, description) VALUES
('Hotels', 'hotels', 'Hotel', '/hotels', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800', 1, true, 'Premium stays across the island.'),
('Activities', 'activities', 'Compass', '/activities', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800', 2, true, 'Unique land and sea experiences.'),
('Flights', 'flights', 'Plane', '/flights', 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=800', 3, true, 'Your wings to the world.'),
('Cruises', 'cruises', 'Ship', '/cruises', 'https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=800', 4, true, 'Luxury on the high seas.'),
('Transfers', 'transfers', 'Car', '/transfers', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800', 5, true, 'Seamless island transit.'),
('Day Packages', 'day-packages', 'Sun', '/day-packages', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800', 6, true, 'Resort luxury for a day.');

INSERT INTO hero_slides (title, subtitle, description, image_url, cta_text, cta_link, is_active, order_index) VALUES
('Your Gateway to Global Discovery', 'IATA ACCREDITED • EST 2010', 'Experience the world with the precision of experts and the passion of travelers.', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920', 'Explore Mauritius', '/hotels', true, 1),
('Mediterranean Grand Voyages', 'EXCLUSIVE CRUISE PACKAGES', 'Sail the azure waters of the Mediterranean with our curated luxury cruise vacations.', 'https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1920', 'View Cruises', '/cruises', true, 2),
('Expert Visa Assistance', 'GLOBAL TRAVEL SOLUTIONS', 'Simplifying global travel with professional visa and document services for over 100 countries.', 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1920', 'Get My Visa', '/visa-services', true, 3);

INSERT INTO menus (title, location, items) VALUES
('Main Navigation', 'header', '[{"label": "Home", "link": "/"}, {"label": "Hotels", "link": "/hotels"}, {"label": "Flights", "link": "/flights"}, {"label": "Cruises", "link": "/cruises"}, {"label": "About", "link": "/about"}]'),
('Footer Quick Links', 'footer', '[{"label": "About Us", "link": "/about"}, {"label": "Careers", "link": "/careers"}, {"label": "Privacy Policy", "link": "/privacy"}, {"label": "FAQ", "link": "/faq"}]');

-- =====================================================
-- 3. CONTENT & TEAM
-- =====================================================

INSERT INTO pages (slug, title, content) VALUES
('about', 'About Us', '{"story": "Leading the way in personalized travel since 2010.", "stats": [{"ext": "15+", "label": "Years"}]}'),
('faq', 'Help Center', '{"headline": "Frequently Asked Questions", "items": []}');

INSERT INTO page_content (slug, title, sections) VALUES
('home-hero', 'Home Hero Content', '[{"type": "hero", "title": "Mauritius Awaits"}]'),
('brand-values', 'Our Core Brand Values', '[{"title": "Excellence", "text": "We strive for perfection in every itinerary."}]');

INSERT INTO team_members (name, role, photo_url, bio, email, is_active) VALUES
('Leena Jhugroo', 'Managing Director', 'https://travellounge.mu/wp-content/uploads/2022/07/Leena-Jhugroo.jpg', 'Visionary leader of Travel Lounge.', 'leena@travellounge.mu', true),
('Kevin Ng', 'Operations Manager', 'https://travellounge.mu/wp-content/uploads/2022/07/Kevin-Ng.jpg', 'Expert in global travel logistics.', 'kevin@travellounge.mu', true),
('Maleekah Amboorallee', 'Senior Travel Consultant', 'https://travellounge.mu/wp-content/uploads/2022/07/Maleekah-Amboorallee.jpg', 'Specialist in luxury island getaways.', 'maleekah@travellounge.mu', true);

-- =====================================================
-- 4. INVENTORY: HOTELS, ROOMS, PRICES
-- =====================================================

DO $$
DECLARE
    v_hotel_id UUID;
    v_room_id UUID;
    v_date DATE;
BEGIN
    -- Four Seasons Resort
    INSERT INTO services (name, category, type, description, location, pricing, images, star_rating, is_featured, amenities, highlights, is_active)
    VALUES (
        'Four Seasons Resort at Anahita', 'hotels', 'luxury', 
        'Secluded tropical sanctuary featuring private villas with pools.', 
        'Beau Champ, East Coast', '{"basePrice": 35000, "currency": "MUR"}'::jsonb, 
        ARRAY['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200'], 5, true, 
        '[{"name": "Private Pool", "icon": "Waves"}]'::jsonb, '[{"title": "Exclusive Villas"}]'::jsonb, true
    ) RETURNING id INTO v_hotel_id;

    INSERT INTO hotel_rooms (service_id, type, name, price_per_night, total_units, features) 
    VALUES (v_hotel_id, 'villa', 'Ocean Pool Villa', 35000, 10, '{"view": "ocean", "size": "105 sqm"}'::jsonb)
    RETURNING id INTO v_room_id;

    -- Seed Daily Prices for the Ocean Pool Villa (Next 7 Days)
    FOR i IN 0..6 LOOP
        v_date := CURRENT_DATE + i;
        INSERT INTO room_daily_prices (room_id, date, price, available_units)
        VALUES (v_room_id, v_date, 35000 + (i * 100), 10);
    END LOOP;

    -- The St. Regis
    INSERT INTO services (name, category, type, description, location, pricing, images, star_rating, is_featured, is_active)
    VALUES (
        'The St. Regis Mauritius Resort', 'hotels', 'luxury', 
        'Colonial-style manor house at the foot of Le Morne.', 
        'Le Morne, South West', '{"basePrice": 28000, "currency": "MUR"}'::jsonb, 
        ARRAY['https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200'], 5, true, true
    ) RETURNING id INTO v_hotel_id;

    INSERT INTO hotel_rooms (service_id, type, name, price_per_night, total_units, features) 
    VALUES (v_hotel_id, 'suite', 'Junior Suite', 28000, 15, '{"view": "ocean", "size": "65 sqm"}'::jsonb)
    RETURNING id INTO v_room_id;

    -- Seed Daily Prices for Junior Suite
    FOR i IN 0..6 LOOP
        v_date := CURRENT_DATE + i;
        INSERT INTO room_daily_prices (room_id, date, price, available_units)
        VALUES (v_room_id, v_date, 28000, 15);
    END LOOP;
END $$;

-- =====================================================
-- 5. TRAVEL PRODUCTS: FLIGHTS, CRUISES, TOURS
-- =====================================================

INSERT INTO flights (airline, flight_number, departure_city, arrival_city, departure_time, arrival_time, price, status, logo_url) VALUES
('Emirates', 'EK 702', 'Mauritius (MRU)', 'Dubai (DXB)', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 6 hours', 25000, 'active', 'https://logo.clearbit.com/emirates.com'),
('Air Mauritius', 'MK 014', 'Mauritius (MRU)', 'Paris (CDG)', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days 12 hours', 38000, 'active', 'https://logo.clearbit.com/airmauritius.com');

INSERT INTO services (name, category, type, description, location, pricing, images, duration, ports, is_active)
VALUES 
('Mediterranean Grand Voyage', 'cruises', 'luxury', '14-day luxury voyage from Barcelona to Rome.', 'Mediterranean', '{"basePrice": 115000, "currency": "MUR"}'::jsonb, ARRAY['https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1200'], '14 Days', 'Barcelona, Rome, Athens', true),
('Magical Morocco Guided Tour', 'group-tours', 'cultural', 'Discover the souks and the Sahara on this 10-day tour.', 'Morocco', '{"basePrice": 75000, "currency": "MUR"}'::jsonb, ARRAY['https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200'], '10 Days', NULL, true);

-- =====================================================
-- 6. SOCIAL & TRUST ELEMENTS
-- =====================================================

INSERT INTO testimonials (customer_name, rating, content, is_featured, is_approved) VALUES
('Sophia Rodriguez', 5, 'Our honeymoon curated by Travel Lounge was magical. Flawless service!', true, true),
('Vikram Singh', 5, 'Best corporate travel partner. Professional and efficient.', true, true);

INSERT INTO reviews (customer_name, rating, comment, status, service_id)
SELECT 'Michael Chen', 5, 'Incredible stay at Anahita. The Four Seasons never disappoints.', 'approved', id 
FROM services WHERE name = 'Four Seasons Resort at Anahita' LIMIT 1;

-- =====================================================
-- 7. TEMPLATES & OPERATIONAL
-- =====================================================

INSERT INTO email_templates (name, subject, body, variables) VALUES
('Booking Confirmation', 'Your Booking is Confirmed!', '<p>Confirming your trip to {{destination}}.</p>', '["destination"]');

INSERT INTO newsletter_subscribers (email, status) VALUES
('vip.client@example.com', 'active'),
('marketing.partner@brand.com', 'active');

INSERT INTO media (filename, url, type, size_bytes, folder, alt_text) VALUES
('beach-hero.jpg', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920', 'image/jpeg', 1024000, 'hero', 'Mauritius Beach');

-- =====================================================
-- 8. SUMMARY LOG
-- =====================================================
INSERT INTO audit_logs (admin_id, action, target_type, details)
VALUES (NULL, 'SEED_COMPLETE', 'SYSTEM', '{"v": "2026-03-06", "status": "Ultimate Seed Success"}');
