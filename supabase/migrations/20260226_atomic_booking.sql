-- Add atomic decrement RPC for bookings
CREATE OR REPLACE FUNCTION decrement_room_inventory(
    p_room_id UUID,
    p_check_in DATE,
    p_check_out DATE
) RETURNS JSONB AS $$
DECLARE
    v_total_price NUMERIC := 0;
    v_days_count INT := 0;
    v_required_days INT;
    v_price_record RECORD;
BEGIN
    -- Calculate required days
    v_required_days := p_check_out - p_check_in;
    
    -- Check availability and calculate price
    FOR v_price_record IN 
        SELECT * FROM room_daily_prices 
        WHERE room_id = p_room_id 
        AND date >= p_check_in 
        AND date < p_check_out
        FOR UPDATE -- Lock rows to prevent race condition
    LOOP
        IF v_price_record.is_blocked OR v_price_record.available_units <= 0 THEN
            RETURN jsonb_build_object('success', false, 'message', 'Conflict: One or more dates are fully booked on ' || v_price_record.date);
        END IF;
        
        v_total_price := v_total_price + v_price_record.price;
        v_days_count := v_days_count + 1;
    END LOOP;

    -- Verify pricing exists for all requested dates
    IF v_days_count < v_required_days THEN
        RETURN jsonb_build_object('success', false, 'message', 'Pricing not set for all requested dates');
    END IF;

    -- Decrement inventory
    UPDATE room_daily_prices 
    SET available_units = available_units - 1,
        is_blocked = CASE WHEN (available_units - 1) <= 0 THEN true ELSE false END
    WHERE room_id = p_room_id 
    AND date >= p_check_in 
    AND date < p_check_out;

    RETURN jsonb_build_object('success', true, 'total_price', v_total_price);
END;
$$ LANGUAGE plpgsql;
