-- ==============================================================================
-- TRAVEL LOUNGE MAURITIUS: PREMIUM ECOSYSTEM SEED (2026-02-25)
-- High-fidelity, production-ready data for all pages and managers.
-- ==============================================================================

-- 1. DYNAMIC PAGES CONTENT
-- Populating the "pages" table for the web application's dynamic routes.
INSERT INTO pages (slug, title, content, meta_title, meta_description) VALUES
('visa-services', 'Visa Services', $${
    "headline": "Professional Visa Assistance & Global Document Solutions",
    "body": "<p>Travel Lounge Mauritius offers comprehensive visa assistance to citizens and residents, simplifying the complex process of securing travel documents for over 100 destinations worldwide. Our dedicated team of experts ensures that your application is handled with precision and care.</p><p>We specialize in <strong>Business, Tourism, and Student visas</strong>, providing personalized guidance through every step of the application process.</p>",
    "hero": {
        "title": "Visa Services",
        "subtitle": "Connecting you to the world with hassle-free document assistance.",
        "image": "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1920"
    }
}$$, 'Visa Services Mauritius | Travel Lounge', 'Expert visa assistance in Mauritius for over 100 countries. Professional guidance for tourism, business, and study visas.'),

('transfers', 'Transfers', $${
    "headline": "Seamless Island Connectivity: Private & VIP Transfers",
    "body": "<p>Arrive in style and comfort with our premium transfer services. Whether you need a private airport pick-up or a dedicated chauffeur for the day, Travel Lounge provides reliable, air-conditioned transportation across Mauritius.</p><p>Our fleet ranges from luxury sedans to spacious coaches for group travel, all driven by professional, bilingual chauffeurs.</p>",
    "hero": {
        "title": "Elite Transfers",
        "subtitle": "Punctual, private, and professional transportation across the island.",
        "image": "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1920"
    }
}$$, 'Private Transfers Mauritius | Airport & VIP Transport', 'Book reliable private transfers in Mauritius. Airport pick-ups, VIP transport, and group coaches with professional drivers.'),

('flights', 'Flights', $${
    "headline": "Global Reach, Local Expertise: Book Your Next Flight",
    "body": "<p>As an IATA accredited agency, Travel Lounge provides access to the best fares from major international airlines. We offer bespoke ticketing services, ensuring you get the most efficient routes and competitive prices.</p><p>From economy class to premium business suites, our consultants find the perfect flight for your budget and schedule.</p>",
    "hero": {
        "title": "Global Flights",
        "subtitle": "Premium ticketing services and exclusive airfares to every corner of the globe.",
        "image": "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=1920"
    }
}$$, 'IATA Flight Bookings Mauritius | International Airfare', 'Book international flights with an IATA accredited agency in Mauritius. Exclusive fares and expert ticketing services.'),

('group-tours', 'Group Tours', $${
    "headline": "Shared Adventures: Expertly Guided Group Tours",
    "body": "<p>Discover the world in the company of like-minded travelers. Our group tours are designed to offer the perfect balance of organized activities and free time, led by expert local guides who bring each destination to life.</p><p>Explore Europe, Asia, and Africa with meticulously planned itineraries and premium accommodations.</p>",
    "hero": {
        "title": "Guided Group Tours",
        "subtitle": "Curated group adventures to the world's most iconic destinations.",
        "image": "https://images.unsplash.com/photo-1539635278303-d4002c07dee3?q=80&w=1920"
    }
}$$, 'Guided Group Tours Mauritius | Curated International Trips', 'Join expertly guided group tours to Europe, Asia, and beyond. Meticulously planned itineraries for the modern traveler.'),

('cruises', 'Cruises', $${
    "headline": "The Ultimate Luxury on the High Seas",
    "body": "<p>Embark on a journey of a lifetime with our selection of world-class cruises. From the Mediterranean to the Caribbean, experience unparalleled luxury, fine dining, and diverse ports of call.</p><p>Travel Lounge partners with the world's leading cruise lines to offer you exclusive deals and premium cabin selections.</p>",
    "hero": {
        "title": "Mediterranean & Caribbean Cruises",
        "subtitle": "Sail the world in luxury with our exclusive cruise partnerships.",
        "image": "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1920"
    }
}$$, 'Luxury Cruises Mauritius | Mediterranean & Caribbean Voyages', 'Discover luxury cruise vacations from Mauritius. Exclusive deals on world-class cruise lines and iconic destinations.'),

('activities', 'Activities', $${
    "headline": "Unforgettable Experiences: Land & Sea Adventures",
    "body": "<p>Mauritius is a playground for adventure seekers and nature lovers. At Travel Lounge, we curate a wide range of activities that showcase the best of our island's natural beauty and vibrant culture.</p><p>From thrilling water sports to tranquil mountain hikes, find your next adventure with us.</p>",
    "hero": {
        "title": "Island Activities",
        "subtitle": "Discover the hidden gems and thrilling adventures of Mauritius.",
        "image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1920"
    }
}$$, 'Activities in Mauritius | Land & Sea Adventures', 'Book the best activities in Mauritius. Catamaran cruises, hiking tours, water sports, and unique island experiences.'),

('day-packages', 'Day Packages', $${
    "headline": "Luxury Within Reach: Premium Day Resort Access",
    "body": "<p>Experience the luxury of Mauritius' finest resorts without the overnight stay. Our curated day packages offer access to private beaches, infinity pools, and gourmet dining at the island's most prestigious five-star properties.</p><p>The perfect escape for locals and visitors alike seeking a day of pure relaxation.</p>",
    "hero": {
        "title": "Resort Day Packages",
        "subtitle": "Access the island's most exclusive resorts for a day of pure luxury.",
        "image": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1920"
    }
}$$, 'Resort Day Packages Mauritius | 5-Star Day Access', 'Enjoy 5-star resort facilities for a day. Access private beaches, pools, and lunch at premium Mauritius hotels.')
ON CONFLICT (slug) DO UPDATE SET 
    content = EXCLUDED.content,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;

-- 2. PREMIUM SERVICE INVENTORY
-- Populating the "services" table with hotels, activities, and cruises.

-- Hotels (Premium Collection)
INSERT INTO services (name, category, type, description, location, pricing, images, star_rating, is_featured, amenities, highlights, is_active) VALUES
('Four Seasons Resort at Anahita', 'hotels', 'luxury', 'Experience a secluded tropical sanctuary on the east coast, featuring private villas with pools and world-class golf.', 'Beau Champ, East Coast', '{"basePrice": 35000, "currency": "MUR"}'::jsonb, ARRAY['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200'], 5, true, '[{"name": "Private Pool", "icon": "Waves"}, {"name": "Golf Course", "icon": "MapPin"}, {"name": "Award-winning Spa", "icon": "Sparkles"}]'::jsonb, '["Exclusive private villas", "Ernie Els designed golf course", "Signature dining experiences"]'::jsonb, true),
('The St. Regis Mauritius Resort', 'hotels', 'luxury', 'Located at the foot of the iconic Le Morne mountain, this colonial-style manor house offers timeless elegance.', 'Le Morne, South West', '{"basePrice": 28000, "currency": "MUR"}'::jsonb, ARRAY['https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200'], 5, true, '[{"name": "Butler Service", "icon": "CheckSquare"}, {"name": "Kite Surfing Center", "icon": "Wind"}, {"name": "Cinema", "icon": "Tv"}]'::jsonb, '["Prime Le Morne location", "Legendary Butler Service", "The Manor House experience"]'::jsonb, true),
('Constance Prince Maurice', 'hotels', 'lifestyle', 'An intimate hideaway designed by architect Jean-Marc Eynaud, offering ultimate privacy and floating dining.', 'Poste de Flacq, North East', '{"basePrice": 22000, "currency": "MUR"}'::jsonb, ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200'], 5, true, '[{"name": "Floating Bar", "icon": "Glass"}, {"name": "Wine Cellar", "icon": "Wine"}, {"name": "Infinity Pool", "icon": "Waves"}]'::jsonb, '["Romantic floating restaurant", "Architectural masterpiece", "Exceptional wine collection"]'::jsonb, true),
('Radisson Blu Azuri Resort', 'hotels', 'family', 'A vibrant seaside resort located within the Azuri village, perfect for family getaways and water activities.', 'Roches Noires, North East', '{"basePrice": 9500, "currency": "MUR"}'::jsonb, ARRAY['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200'], 4, false, '[{"name": "Kids Club", "icon": "Users"}, {"name": "Marine Center", "icon": "Anchor"}, {"name": "Market Village", "icon": "ShoppingBag"}]'::jsonb, '["Village atmosphere", "Direct beach access", "Extensive water sports"]'::jsonb, true),
('Cotton Bay Hotel Rodrigues', 'hotels', 'Rodrigues', 'A charming retreat on the pristine coast of Rodrigues, offering tranquility and authentic local hospitality.', 'Pointe Coton, Rodrigues', '{"basePrice": 7500, "currency": "MUR"}'::jsonb, ARRAY['https://images.unsplash.com/photo-1589394815804-964ed7be2eb5?q=80&w=1200'], 4, true, '[{"name": "Beachfront", "icon": "Sun"}, {"name": "Rodriguan Cuisine", "icon": "Utensils"}, {"name": "Dive Center", "icon": "Anchor"}]'::jsonb, '["Best beach in Rodrigues", "Authentic island vibe", "Excellent diving spots"]'::jsonb, true);

-- Activities (Land & Sea)
INSERT INTO services (name, category, type, description, location, pricing, images, duration, is_featured, highlights, is_active) VALUES
('Private Catamaran: Ile aux Cerfs', 'activities', 'Sea', 'A luxury full-day private cruise to the iconic Ile aux Cerfs island, featuring a lobster BBQ and snorkeling.', 'Trou d''Eau Douce', '{"basePrice": 4500, "currency": "MUR"}'::jsonb, ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200'], '7 Hours', true, '["Lobster BBQ lunch on board", "Private snorkeling at selected spots", "Sunset views on return"]'::jsonb, true),
('Casela: Walk with Lions', 'activities', 'Wildlife', 'A once-in-a-lifetime encounter with the kings of the jungle in a safe, guided safari environment.', 'Cascavelle, West', '{"basePrice": 6500, "currency": "MUR"}'::jsonb, ARRAY['https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1200'], '1 Hour', true, '["Guided safari walk", "Professional photography included", "Casela park entry included"]'::jsonb, true),
('Le Morne: Sunrise Hike', 'activities', 'Land', 'Scale the UNESCO World Heritage site of Le Morne Brabant with an expert mountain guide for breathtaking views.', 'Le Morne, South West', '{"basePrice": 2500, "currency": "MUR"}'::jsonb, ARRAY['https://images.unsplash.com/photo-1589182373726-e4f6d65d8f03?q=80&w=1200'], '4 Hours', true, '["UNESCO World Heritage Site", "Experienced mountain guides", "Epic photography opportunities"]'::jsonb, true),
('Quad Biking: South Safari', 'activities', 'Adventure', 'Explore the rugged landscapes, waterfalls, and savannahs of the south on a powerful 4x4 quad bike.', 'Bel Ombre', '{"basePrice": 3500, "currency": "MUR"}'::jsonb, ARRAY['https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?q=80&w=1200'], '2 Hours', false, '["Off-road forest tracks", "Waterfall visit", "Scenic coastal viewpoints"]'::jsonb, true),
('Blue Safari: Submarine Dive', 'activities', 'Sea', 'Dive to 35 meters depth in a real submarine and discover the marine life and shipwrecks of the north.', 'Trou aux Biches', '{"basePrice": 5200, "currency": "MUR"}'::jsonb, ARRAY['https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=1200'], '2 Hours', true, '["35m deep submarine dive", "View real shipwrecks", "Safe and pressurized environment"]'::jsonb, true);

-- 3. TESTIMONIALS & TEAM
INSERT INTO testimonials (customer_name, avatar_url, rating, content, is_featured, is_approved) VALUES
('Michael Chen', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', 5, 'The visa assistance was flawless. Travel Lounge handled my complex Schengen application with ease. Highly recommended!', true, true),
('Sophia Rodriguez', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', 5, 'Our honeymoon at the St. Regis was magical. The team curated every detail, from the flights to the private dinners. Thank you!', true, true),
('Vikram Singh', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200', 5, 'Best corporate travel partner in Mauritius. Efficient, professional, and always available.', true, true);

INSERT INTO team_members (name, role, photo_url, bio, email, is_active) VALUES
('Leena Jhugroo', 'Managing Director', 'https://travellounge.mu/wp-content/uploads/2022/07/Leena-Jhugroo.jpg', 'Visionary leader of Travel Lounge with extensive experience in international tourism.', 'leena@travellounge.mu', true),
('Nalini Indurjeet', 'Senior Sales Executive Corporate', 'https://travellounge.mu/wp-content/uploads/2022/07/Nalini-Indurjeet.jpg', 'Expert in bespoke corporate travel solutions and client relationship management.', 'nalini@travellounge.mu', true),
('Nabila Ramjaun', 'Senior Sales Executive Corporate', 'https://travellounge.mu/wp-content/uploads/2022/07/Nabila-Ramjaun.jpg', 'Specialist in complex corporate itineraries and global travel logistics.', 'nabila@travellounge.mu', true),
('Kirtee Boodoo', 'Senior Sales Executive Leisure', 'https://travellounge.mu/wp-content/uploads/2022/07/Kirtee-Boodoo.jpg', 'Dedicated to creating unforgettable holiday experiences for our leisure clients.', 'kirtee@travellounge.mu', true),
('Maleekah Amboorallee', 'Travel Consultant', 'https://travellounge.mu/wp-content/uploads/2022/07/Maleekah-Amboorallee.jpg', 'Expert travel advisor focused on personalized service and destination knowledge.', 'maleekah@travellounge.mu', true),
('Mandini Boolauk', 'Travel Consultant', 'https://travellounge.mu/wp-content/uploads/2022/07/Mandini-Boolauk.jpg', 'Passionate about discovering new destinations and helping clients plan their perfect trip.', 'mandini@travellounge.mu', true),
('Manshi Rughoobur', 'Account Clerk', 'https://travellounge.mu/wp-content/uploads/2022/07/Manshi-Rughoobur.jpg', 'Managing our financial logistics with precision and efficiency.', 'accounts@travellounge.mu', true);

-- 4. CORE CATEGORIES & HERO
INSERT INTO categories (name, slug, icon, link, image_url, display_order, show_on_home) VALUES
('Hotels', 'hotels', 'Hotel', '/hotels', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800', 1, true),
('Activities', 'activities', 'Compass', '/activities', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800', 2, true),
('Flights', 'flights', 'Plane', '/flights', 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=800', 3, true),
('Cruises', 'cruises', 'Ship', '/cruises', 'https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=800', 4, true),
('Transfers', 'transfers', 'Car', '/transfers', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800', 5, true),
('Day Packages', 'day-packages', 'Sun', '/day-packages', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800', 6, true);

INSERT INTO hero_slides (title, subtitle, description, image_url, cta_text, cta_link, is_active) VALUES
('Your Gateway to Global Discovery', 'IATA ACCREDITED • EST 2010', 'Experience the world with the precision of experts and the passion of travelers.', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920', 'Explore Mauritius', '/hotels', true),
('Mediterranean Grand Voyages', 'EXCLUISVE CRUISE PACKAGES', 'Sail the azure waters of the Mediterranean with our curated luxury cruise vacations.', 'https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1920', 'View Cruises', '/cruises', true),
('Expert Visa Assistance', 'GLOBAL TRAVEL SOLUTIONS', 'Simplifying global travel with professional visa and document services for over 100 countries.', 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1920', 'Get My Visa', '/visa-services', true);
