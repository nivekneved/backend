-- =====================================================
-- TRAVEL LOUNGE MAURITIUS: SEA ACTIVITIES SEED DATA
-- =====================================================

INSERT INTO services (
    name, 
    category, 
    type, 
    description, 
    location, 
    pricing, 
    images, 
    duration, 
    rating, 
    is_active, 
    is_featured,
    display_order
) VALUES
(
    'Deep Sea Fishing Expedition', 
    'Sea Activities', 
    'water', 
    'Experience the thrill of big game fishing in the deep waters of the Indian Ocean. Targeted species include Blue Marlin, Black Marlin, and Yellowfin Tuna.', 
    'Black River', 
    '{"price": 18000, "currency": "MUR", "pax": "Private Boat (up to 4)"}'::jsonb, 
    ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80'], 
    'Full Day', 
    4.9, 
    true, 
    true,
    0
),
(
    'Private Luxury Sunset Cruise', 
    'Sea Activities', 
    'water', 
    'A romantic and exclusive sunset cruise along the northern coast. Includes premium champagne, gourmet appetizers, and live acoustic music.', 
    'Grand Baie', 
    '{"price": 12500, "currency": "MUR", "pax": "Couple"}'::jsonb, 
    ARRAY['https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1200&q=80'], 
    '3 Hours', 
    5.0, 
    true, 
    true,
    1
),
(
    'Scuba Diving: The Cathedral', 
    'Sea Activities', 
    'water', 
    'Discover one of the most famous dive sites in Mauritius. This underwater cave system offers breathtaking architecture and diverse marine life.', 
    'Flic en Flac', 
    '{"price": 4500, "currency": "MUR", "pax": "Per Person"}'::jsonb, 
    ARRAY['https://images.unsplash.com/photo-1544551763-8dd44758c2dd?auto=format&fit=crop&w=1200&q=80'], 
    '4 Hours', 
    4.8, 
    true, 
    false,
    2
),
(
    'Parasailing Adventure', 
    'Sea Activities', 
    'water', 
    'Soar above the turquoise lagoon of Blue Bay and enjoy panoramic views of the southeast coast. An exhilarating experience for all ages.', 
    'Blue Bay', 
    '{"price": 2800, "currency": "MUR", "pax": "Per Person"}'::jsonb, 
    ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80'], 
    '20 Minutes', 
    4.7, 
    true, 
    false,
    3
),
(
    'Swimming with Wild Dolphins', 
    'Sea Activities', 
    'water', 
    'An unforgettable encounter with Spinner and Bottlenose dolphins in their natural habitat. Followed by snorkeling at the Crystal Rock.', 
    'Le Morne', 
    '{"price": 3800, "currency": "MUR", "pax": "Per Person"}'::jsonb, 
    ARRAY['https://images.unsplash.com/photo-1570534064391-7f9ee161b18c?auto=format&fit=crop&w=1200&q=80'], 
    'Half Day', 
    4.9, 
    true, 
    true,
    4
);
