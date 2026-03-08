-- ==============================================================================
-- TRAVEL LOUNGE MAURITIUS: MASTER ECOSYSTEM SEED (2026-02-26)
-- Comprehensive, high-fidelity, production-ready data for the entire platform.
-- Includes settings, menus, pages, heroes, services, rooms, flights, reviews & bookings.
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
  services,
  hotel_rooms,
  room_daily_prices,
  reviews,
  bookings
  RESTART IDENTITY CASCADE;

-- =====================================================
-- 1. SYSTEM CONFIGURATION & THEMING
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

-- Email Templates
INSERT INTO email_templates (name, subject, body, variables) VALUES
('Booking Confirmation', 'Booking Confirmation - Travel Lounge', '<p>Dear {{name}},</p><p>Your booking for <strong>{{service}}</strong> has been confirmed.</p><p>Total: {{total_price}}</p><p>Thank you for choosing Travel Lounge.</p>', '["name", "service", "total_price"]'),
('Welcome Email', 'Welcome to Travel Lounge!', '<p>Welcome {{name}}!</p><p>We are thrilled to have you. Explore our premium travel packages and plan your next getaway today.</p>', '["name"]'),
('New Newsletter Subscriber', 'Thank you for subscribing!', '<p>Hi there,</p><p>You are now subscribed to the Travel Lounge newsletter. Expect exclusive travel deals soon!</p>', '[]');


-- =====================================================
-- 2. NAVIGATION MENUS
-- =====================================================

INSERT INTO menus (title, location, items) VALUES
('Main Navigation', 'header', '[
    {"label": "Home", "link": "/"},
    {
        "label": "Travel Abroad",
        "link": "#",
        "children": [
            {"label": "Book a Flight", "link": "/flights", "icon": "Plane"},
            {"label": "Cruise Vacations", "link": "/cruises", "icon": "Ship"},
            {"label": "Guided Group Tours", "link": "/group-tours", "icon": "UsersRound"},
            {"label": "Visa Services", "link": "/visa-services", "icon": "FileText"}
        ]
    },
    {"label": "Hotels", "link": "/hotels", "icon": "Hotel"},
    {
        "label": "Local Deals",
        "link": "#",
        "children": [
            {"label": "Land Activities", "link": "/activities?category=Land"},
            {"label": "Sea Activities", "link": "/activities?category=Sea"},
            {"label": "Hotel Day Packages", "link": "/day-packages", "icon": "Calendar"}
        ]
    },
    {"label": "Transfers", "link": "/transfers", "icon": "Car"},
    {
        "label": "About",
        "link": "#",
        "children": [
            {"label": "Our Story", "link": "/about"},
            {"label": "The Team", "link": "/team"},
            {"label": "Contact", "link": "/contact"}
        ]
    }
]'),
('Footer Quick Links', 'footer', '[
    {"label": "About Us", "link": "/about"},
    {"label": "Careers", "link": "/careers"},
    {"label": "Privacy Policy", "link": "/privacy"},
    {"label": "Terms & Conditions", "link": "/terms"},
    {"label": "FAQ", "link": "/faq"}
]');


-- =====================================================
-- 3. MARKETING & BRANDING
-- =====================================================

-- Core Categories
INSERT INTO categories (name, slug, icon, link, image_url, display_order, show_on_home) VALUES
('Hotels', 'hotels', 'Hotel', '/hotels', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800', 1, true),
('Activities', 'activities', 'Compass', '/activities', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800', 2, true),
('Flights', 'flights', 'Plane', '/flights', 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=800', 3, true),
('Cruises', 'cruises', 'Ship', '/cruises', 'https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=800', 4, true),
('Transfers', 'transfers', 'Car', '/transfers', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800', 5, true),
('Day Packages', 'day-packages', 'Sun', '/day-packages', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800', 6, true);

-- Hero Slides
INSERT INTO hero_slides (title, subtitle, description, image_url, cta_text, cta_link, is_active, order_index) VALUES
('Your Gateway to Global Discovery', 'IATA ACCREDITED • EST 2010', 'Experience the world with the precision of experts and the passion of travelers.', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920', 'Explore Mauritius', '/hotels', true, 1),
('Mediterranean Grand Voyages', 'EXCLUISVE CRUISE PACKAGES', 'Sail the azure waters of the Mediterranean with our curated luxury cruise vacations.', 'https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1920', 'View Cruises', '/cruises', true, 2),
('Expert Visa Assistance', 'GLOBAL TRAVEL SOLUTIONS', 'Simplifying global travel with professional visa and document services for over 100 countries.', 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1920', 'Get My Visa', '/visa-services', true, 3);

-- Promotions
INSERT INTO promotions (title, description, image, link, valid_until, is_active) VALUES
('Summer Early Bird', 'Book your summer holiday before May and save up to 20% on all hotels.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800', '/hotels', '2027-05-01', true),
('Honeymoon Package', 'Exclusive romantic getaway deals including private transfers and couples massages.', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800', '/day-packages', '2027-12-31', true),
('Flash Sale: Dubai Flights', 'Emirates round-trip to Dubai starting at Rs 25,000. Limited seats available.', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800', '/flights', '2026-03-31', true);


-- =====================================================
-- 4. INFORMATION, PAGES & TRUST
-- =====================================================

-- Dynamic Pages
INSERT INTO pages (slug, title, content, meta_title, meta_description) VALUES
('about', 'About Us', $${
    "hero": {
        "title": "Crafting Memories",
        "subtitle": "Est. 2010",
        "image_url": "https://images.unsplash.com/photo-1544391626-d6215112fa59?auto=format&fit=crop&q=80&w=1920"
    },
    "stats": [
        { "label": "Years Experience", "value": "15+" },
        { "label": "Happy Travelers", "value": "50k+" },
        { "label": "Destinations", "value": "100+" },
        { "label": "Support", "value": "24/7" }
    ],
    "story": {
        "title": "Redefining Luxury Travel in Mauritius",
        "paragraphs": [
            "Founded on the principles of excellence and personalization, Travel Lounge has grown from a boutique agency to a premier travel partner for thousands of clients worldwide. We believe that travel is not just about the destination, but about the feelings, memories, and connections made along the way."
        ],
        "images": [
            "https://images.unsplash.com/photo-1572978394861-fb964f9f7596?auto=format&fit=crop&w=800",
            "https://images.unsplash.com/photo-1589519160732-57fc498494f8?auto=format&fit=crop&w=600"
        ]
    },
    "values": [
        { "title": "Trusted & Secure", "description": "Registered, bonded, and insured. Your peace of mind is our top priority.", "icon": "ShieldCheck" },
        { "title": "Personalized Care", "description": "A dedicated travel specialist accompanies you from planning to return.", "icon": "Users" },
        { "title": "Unbeatable Value", "description": "Exclusive partnerships allow us to offer you the best rates and perks.", "icon": "Target" }
    ]
}$$, 'About Travel Lounge | Mauritius Premier Travel Agency', 'Learn about Travel Lounge Mauritius. Over 15 years of experience crafting personalized luxury travel experiences worldwide.'),

('visa-services', 'Visa Services', $${
    "headline": "Professional Visa Assistance & Global Document Solutions",
    "body": "<p>Travel Lounge Mauritius offers comprehensive visa assistance to citizens and residents, simplifying the complex process of securing travel documents for over 100 destinations worldwide. Our dedicated team of experts ensures that your application is handled with precision and care.</p><p>We specialize in <strong>Business, Tourism, and Student visas</strong>, providing personalized guidance through every step of the application process.</p>",
    "hero": {
        "title": "Visa Services",
        "subtitle": "Connecting you to the world with hassle-free document assistance.",
        "image": "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1920"
    }
}$$, 'Visa Services Mauritius | Travel Lounge', 'Expert visa assistance in Mauritius for over 100 countries. Professional guidance for tourism, business, and study visas.'),

('faq', 'Frequently Asked Questions', $${
    "headline": "Frequently Asked Questions",
    "body": "Find answers to the most common queries regarding our services.",
    "faqs": [
        {"q": "Do you provide customized holiday packages?", "a": "Yes! Our travel consultants specialize in building tailor-made itineraries to suit your specific budget, schedule, and preferences."},
        {"q": "Are airport transfers included in hotel bookings?", "a": "Transfers are usually optional and can be easily added to any hotel or flight booking during checkout."},
        {"q": "How can I pay for my booking?", "a": "We accept secure online payments via credit card (Visa, Mastercard, Amex), bank transfers, and MCB Juice."}
    ],
    "hero": {
        "title": "Help Center",
        "subtitle": "Everything you need to know about traveling with us.",
        "image": "https://images.unsplash.com/photo-1499591934245-40b55745b905?q=80&w=1920"
    }
}$$, 'FAQ | Travel Lounge Help Center', 'Find answers to common questions about booking flights, hotels, and tours with Travel Lounge Mauritius.');


-- Team Members
INSERT INTO team_members (name, role, photo_url, bio, email, is_active) VALUES
('Leena Jhugroo', 'Managing Director', 'https://travellounge.mu/wp-content/uploads/2022/07/Leena-Jhugroo.jpg', 'Visionary leader of Travel Lounge with extensive experience in international tourism.', 'leena@travellounge.mu', true),
('Nalini Indurjeet', 'Senior Sales Executive Corporate', 'https://travellounge.mu/wp-content/uploads/2022/07/Nalini-Indurjeet.jpg', 'Expert in bespoke corporate travel solutions and client relationship management.', 'nalini@travellounge.mu', true),
('Nabila Ramjaun', 'Senior Sales Executive Corporate', 'https://travellounge.mu/wp-content/uploads/2022/07/Nabila-Ramjaun.jpg', 'Specialist in complex corporate itineraries and global travel logistics.', 'nabila@travellounge.mu', true),
('Kirtee Boodoo', 'Senior Sales Executive Leisure', 'https://travellounge.mu/wp-content/uploads/2022/07/Kirtee-Boodoo.jpg', 'Dedicated to creating unforgettable holiday experiences for our leisure clients.', 'kirtee@travellounge.mu', true),
('Maleekah Amboorallee', 'Travel Consultant', 'https://travellounge.mu/wp-content/uploads/2022/07/Maleekah-Amboorallee.jpg', 'Expert travel advisor focused on personalized service and destination knowledge.', 'maleekah@travellounge.mu', true),
('Mandini Boolauk', 'Travel Consultant', 'https://travellounge.mu/wp-content/uploads/2022/07/Mandini-Boolauk.jpg', 'Passionate about discovering new destinations and helping clients plan their perfect trip.', 'mandini@travellounge.mu', true),
('Manshi Rughoobur', 'Account Clerk', 'https://travellounge.mu/wp-content/uploads/2022/07/Manshi-Rughoobur.jpg', 'Managing our financial logistics with precision and efficiency.', 'accounts@travellounge.mu', true);


-- Testimonials
INSERT INTO testimonials (customer_name, avatar_url, rating, content, is_featured, is_approved) VALUES
('Michael Chen', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', 5, 'The visa assistance was flawless. Travel Lounge handled my complex Schengen application with ease. Highly recommended!', true, true),
('Sophia Rodriguez', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', 5, 'Our honeymoon at the St. Regis was magical. The team curated every detail, from the flights to the private dinners. Thank you!', true, true),
('Vikram Singh', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200', 5, 'Best corporate travel partner in Mauritius. Efficient, professional, and always available. They always secure the best flight rates for our regional team.', true, true),
('Emma Thompson', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200', 4, 'Booked our family cruise through Travel Lounge. The entire process was smooth, and the personalized itinerary tips were incredibly helpful.', false, true),
('Jean-Luc Morel', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200', 5, 'Amazing day package at Constance Prince Maurice! Effortless booking online and a tremendous local getaway.', false, true);


-- =====================================================
-- 5. PREMIUM INVENTORY (Hotels, Cruises, Activities, Tours)
-- =====================================================

DO $$
DECLARE
    v_service_id UUID;
BEGIN
    -- --------------------------------------------------------------------------
    -- 5A. HOTELS & ROOMS
    -- --------------------------------------------------------------------------
    
    -- Four Seasons Resort
    INSERT INTO services (name, category, type, description, location, pricing, images, star_rating, is_featured, amenities, highlights, is_active)
    VALUES (
        'Four Seasons Resort at Anahita', 'hotels', 'luxury', 
        'Experience a secluded tropical sanctuary on the east coast, featuring private villas with pools and world-class golf.', 
        'Beau Champ, East Coast', '{"basePrice": 35000, "currency": "MUR"}'::jsonb, 
        ARRAY['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200'], 
        5, true, 
        '[{"name": "Private Pool", "icon": "Waves"}, {"name": "Golf Course", "icon": "MapPin"}, {"name": "Award-winning Spa", "icon": "Sparkles"}]'::jsonb, 
        '[{"title": "Exclusive Private Villas"}, {"title": "Ernie Els designed golf course"}, {"title": "Signature dining experiences"}]'::jsonb, true
    ) RETURNING id INTO v_service_id;

    INSERT INTO hotel_rooms (service_id, type, name, price_per_night, total_units, features) VALUES 
    (v_service_id, 'villa', 'Ocean Pool Villa', 35000, 10, '{"view": "ocean", "bed": "king", "pool": "private", "size": "105 sqm"}'::jsonb),
    (v_service_id, 'residence', '2-Bedroom Garden Residence', 65000, 3, '{"view": "garden", "bed": "king & twin", "pool": "private", "size": "250 sqm"}'::jsonb);

    -- The St. Regis
    INSERT INTO services (name, category, type, description, location, pricing, images, star_rating, is_featured, amenities, highlights, is_active)
    VALUES (
        'The St. Regis Mauritius Resort', 'hotels', 'luxury', 
        'Located at the foot of the iconic Le Morne mountain, this colonial-style manor house offers timeless elegance.', 
        'Le Morne, South West', '{"basePrice": 28000, "currency": "MUR"}'::jsonb, 
        ARRAY['https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200'], 
        5, true, 
        '[{"name": "Butler Service", "icon": "CheckSquare"}, {"name": "Kite Surfing Center", "icon": "Wind"}, {"name": "Cinema", "icon": "Tv"}]'::jsonb, 
        '[{"title": "Prime Le Morne location"}, {"title": "Legendary Butler Service"}, {"title": "The Manor House experience"}]'::jsonb, true
    ) RETURNING id INTO v_service_id;

    INSERT INTO hotel_rooms (service_id, type, name, price_per_night, total_units, features) VALUES 
    (v_service_id, 'suite', 'Junior Suite', 28000, 15, '{"view": "ocean", "bed": "king", "balcony": true, "size": "65 sqm"}'::jsonb),
    (v_service_id, 'suite', 'St. Regis Grand Suite', 85000, 1, '{"view": "beachfront", "bed": "king", "butler": true, "size": "150 sqm"}'::jsonb);

    -- --------------------------------------------------------------------------
    -- 5B. CRUISES (Treated as services with 'cabins' mapped as hotel_rooms)
    -- --------------------------------------------------------------------------
    
    INSERT INTO services (name, category, type, description, location, pricing, images, duration, ports, is_featured, amenities, highlights, itinerary, is_active)
    VALUES (
        'MSC Splendida: Red Sea & Mediterranean', 'cruises', 'luxury', 
        'Sail on the magnificent MSC Splendida from the Red Sea up to the cultural hubs of the Mediterranean.', 
        'Departs Safaga, Egypt', '{"basePrice": 45000, "currency": "MUR"}'::jsonb, 
        ARRAY['https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1200'], 
        '9 Nights', 'Safaga, Aqaba, Jeddah, Naples', true, 
        '[{"name": "Aurea Spa", "icon": "Sparkles"}, {"name": "Broadway Theatre", "icon": "Tv"}, {"name": "Infinity Pool", "icon": "Waves"}]'::jsonb, 
        '[{"title": "Premium Dining Inclusive"}, {"title": "VIP Yacht Club Available"}, {"title": "Nightly Entertainment"}]'::jsonb, 
        '[{"day": "Day 1", "title": "Embarkation in Safaga", "description": "Board the MSC Splendida. Evening departure."}, {"day": "Day 2", "title": "Aqaba (Petra)", "description": "Explore the ancient, rose-red city of Petra."}, {"day": "Day 3", "title": "At Sea", "description": "Enjoy the onboard amenities and spa."}]'::jsonb, true
    ) RETURNING id INTO v_service_id;

    -- Cruise Cabins mapped as "rooms"
    INSERT INTO hotel_rooms (service_id, type, name, price_per_night, total_units, features) VALUES 
    (v_service_id, 'inside', 'Interior Cabin Bella', 45000, 50, '{"size": "15 sqm", "bed": "queen"}'::jsonb),
    (v_service_id, 'oceanview', 'Ocean View Fantastica', 58000, 30, '{"size": "18 sqm", "bed": "queen", "view": "window"}'::jsonb),
    (v_service_id, 'balcony', 'Balcony Aurea', 85000, 20, '{"size": "21 sqm", "bed": "king", "view": "balcony", "perks": "spa access"}'::jsonb);

    -- --------------------------------------------------------------------------
    -- 5C. GROUP TOURS
    -- --------------------------------------------------------------------------
    INSERT INTO services (name, category, type, description, location, pricing, images, duration, is_featured, amenities, highlights, itinerary, inclusions, is_active)
    VALUES (
        'Magical Morocco Explorer', 'group-tours', 'cultural', 
        'Discover the vibrant souks of Marrakech, the vast Sahara desert, and the blue streets of Chefchaouen on this comprehensive guided tour.', 
        'Morocco', '{"basePrice": 75000, "currency": "MUR"}'::jsonb, 
        ARRAY['https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200'], 
        '10 Days', true, 
        '[{"name": "Expert Guide", "icon": "Users"}, {"name": "4 & 5 Star Hotels", "icon": "Hotel"}, {"name": "Air-Conditioned Coach", "icon": "Car"}]'::jsonb, 
        '[{"title": "Camel trek in the Sahara"}, {"title": "Guided tour of Marrakech Medina"}, {"title": "Visit to Ait Benhaddou"}]'::jsonb, 
        '[{"day": "Day 1", "title": "Arrival in Casablanca", "description": "Meet your guide and transfer to hotel. Visit Hassan II Mosque."}, {"day": "Day 2", "title": "Rabat to Fes", "description": "Explore the capital Rabat, then proceed to the ancient city of Fes."}, {"day": "Day 3", "title": "Sahara Desert Bound", "description": "Travel through the Atlas mountains to Merzouga for a camel trek."}]'::jsonb, 
        '[{"title": "Round-trip flights from MRU"}, {"title": "All accommodations"}, {"title": "Breakfast and selected dinners"}]'::jsonb, true
    );

    -- --------------------------------------------------------------------------
    -- 5D. ACTIVITIES (Land & Sea)
    -- --------------------------------------------------------------------------
    INSERT INTO services (name, category, type, description, location, pricing, images, duration, is_featured, highlights, is_active) VALUES
    ('Private Catamaran: Ile aux Cerfs', 'activities', 'Sea', 'A luxury full-day private cruise to the iconic Ile aux Cerfs island, featuring a lobster BBQ and snorkeling.', 'Trou d''Eau Douce', '{"basePrice": 4500, "currency": "MUR"}'::jsonb, ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200'], '7 Hours', true, '[{"title": "Lobster BBQ lunch on board"}, {"title": "Private snorkeling"}, {"title": "Sunset views"}]'::jsonb, true),
    ('Casela: Walk with Lions', 'activities', 'Land', 'A once-in-a-lifetime encounter with the kings of the jungle in a safe, guided safari environment.', 'Cascavelle, West', '{"basePrice": 6500, "currency": "MUR"}'::jsonb, ARRAY['https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1200'], '1 Hour', true, '[{"title": "Guided safari walk"}, {"title": "Professional photography"}, {"title": "Casela park entry"}]'::jsonb, true),
    ('Blue Safari: Submarine Dive', 'activities', 'Sea', 'Dive to 35 meters depth in a real submarine and discover the marine life and shipwrecks of the north.', 'Trou aux Biches', '{"basePrice": 5200, "currency": "MUR"}'::jsonb, ARRAY['https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=1200'], '2 Hours', true, '[{"title": "35m deep submarine dive"}, {"title": "View real shipwrecks"}, {"title": "Safe, pressurized environment"}]'::jsonb, true);

END $$;


-- =====================================================
-- 6. FLIGHTS INVENTORY
-- =====================================================

INSERT INTO flights (airline, flight_number, departure_city, arrival_city, departure_time, arrival_time, price, status, logo_url) VALUES
('Emirates', 'EK 702', 'Mauritius (MRU)', 'Dubai (DXB)', NOW() + INTERVAL '2 days' + INTERVAL '16 hours', NOW() + INTERVAL '2 days' + INTERVAL '22 hours', 25000, 'active', 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg'),
('Air Mauritius', 'MK 014', 'Mauritius (MRU)', 'Paris (CDG)', NOW() + INTERVAL '5 days' + INTERVAL '22 hours', NOW() + INTERVAL '6 days' + INTERVAL '10 hours', 38000, 'active', 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Air_Mauritius_Logo.svg/1200px-Air_Mauritius_Logo.svg.png'),
('South African Airways', 'SA 191', 'Mauritius (MRU)', 'Johannesburg (JNB)', NOW() + INTERVAL '1 day' + INTERVAL '9 hours', NOW() + INTERVAL '1 day' + INTERVAL '13 hours', 15000, 'active', 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/South_African_Airways_logo.svg/1200px-South_African_Airways_logo.svg.png');


-- =====================================================
-- 7. OPERATIONAL DATA (Newsletters, Booking logs, etc)
-- =====================================================

INSERT INTO newsletter_subscribers (email, status) VALUES
('vip.client@example.com', 'active'),
('marketing.partner@brand.com', 'active'),
('corporate.contact@agency.com', 'unsubscribed');

-- Create a sample booking for the dashboard data visualization
DO $$
DECLARE
    v_hotel_id UUID;
BEGIN
    SELECT id INTO v_hotel_id FROM services WHERE name = 'The St. Regis Mauritius Resort' LIMIT 1;
    
    IF v_hotel_id IS NOT NULL THEN
        INSERT INTO bookings (customer_info, service_id, service_type, status, booking_details, total_price, payment_status, created_at)
        VALUES (
            '{"name": "Alex Mercer", "email": "alex@example.com", "phone": "555-0102"}'::jsonb,
            v_hotel_id,
            'hotel',
            'confirmed',
            '{"checkIn": "2026-11-10", "checkOut": "2026-11-15", "guests": 2, "roomName": "Junior Suite"}'::jsonb,
            140000,
            'paid',
            NOW() - INTERVAL '2 days'
        );
    END IF;
END $$;
