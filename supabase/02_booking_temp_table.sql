-- ==============================================================================
-- TRAVEL LOUNGE MAURITIUS: TEMPORARY BOOKING TABLE & TRIGGER
-- Validates Server-side Pricing
-- ==============================================================================

-- 1. Create temporary booking_requests table
CREATE TABLE IF NOT EXISTS booking_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_info JSONB NOT NULL,
  service_id UUID REFERENCES services(id),
  service_type VARCHAR(50) NOT NULL,
  room_id UUID REFERENCES hotel_rooms(id),
  booking_details JSONB NOT NULL,
  consent BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'processing',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Enable RLS and allow public inserts
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert booking requests" ON booking_requests;
CREATE POLICY "Anyone can insert booking requests" ON booking_requests FOR INSERT WITH CHECK (true);

-- 3. Trigger Function to securely process the booking
CREATE OR REPLACE FUNCTION process_booking_request()
RETURNS TRIGGER AS $$
DECLARE
  v_final_price DECIMAL(10, 2) := 0;
  v_check_in DATE;
  v_check_out DATE;
  v_nights INTEGER;
  v_service_record RECORD;
  v_is_blocked BOOLEAN := false;
  v_total_price_calc DECIMAL(10, 2) := 0;
BEGIN
  -- Extract Dates from JSONB safely
  v_check_in := (NEW.booking_details->>'checkIn')::DATE;
  v_check_out := (NEW.booking_details->>'checkOut')::DATE;
  
  -- Price Calculation Logic
  IF NEW.room_id IS NOT NULL THEN
    -- Handle Room Pricing
    SELECT COALESCE(SUM(price), 0), bool_or(is_blocked OR COALESCE(available_units, 1) <= 0)
    INTO v_total_price_calc, v_is_blocked
    FROM room_daily_prices
    WHERE room_id = NEW.room_id AND date >= v_check_in AND date < v_check_out;

    IF v_is_blocked THEN
      RAISE EXCEPTION 'Conflict: One or more dates are fully booked';
    END IF;

    -- Decrement inventory (Server-side safe)
    UPDATE room_daily_prices
    SET available_units = COALESCE(available_units, 1) - 1,
        is_blocked = (COALESCE(available_units, 1) - 1 <= 0)
    WHERE room_id = NEW.room_id AND date >= v_check_in AND date < v_check_out;
    
    v_final_price := v_total_price_calc;
    
  ELSIF NEW.service_id IS NOT NULL AND NEW.service_id::text != 'static-inquiry' THEN
    -- General service pricing (Activities, Cruises, etc.)
    SELECT * INTO v_service_record FROM services WHERE id = NEW.service_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Service not found';
    END IF;

    v_nights := GREATEST(1, v_check_out - v_check_in);
    
    -- Extract base price from jsonb safely based on structure observed
    v_final_price := COALESCE(
      (v_service_record.pricing->>'price')::DECIMAL, 
      (v_service_record.pricing->>'base_price')::DECIMAL, 
      (v_service_record.pricing->>'adult')::DECIMAL, 
      (v_service_record.pricing->>'basePrice')::DECIMAL,
      0
    ) * v_nights;
  ELSE
    -- Package Request / Fallback
    v_final_price := 0;
  END IF;

  -- Insert securely into the main bookings table
  INSERT INTO bookings (
    customer_info,
    service_id,
    service_type,
    booking_details,
    total_price,
    status
  ) VALUES (
    NEW.customer_info,
    NEW.service_id,
    NEW.service_type,
    NEW.booking_details,
    v_final_price,
    'pending'
  );

  -- Optionally set the request status to completed
  -- Or simply delete the request if you don't want temp records piling up
  -- DELETE FROM booking_requests WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Attach Trigger
DROP TRIGGER IF EXISTS booking_request_insert_trigger ON booking_requests;
CREATE TRIGGER booking_request_insert_trigger
AFTER INSERT ON booking_requests
FOR EACH ROW
EXECUTE FUNCTION process_booking_request();
