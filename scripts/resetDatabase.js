const supabase = require('../config/supabase');

const reset = async () => {
    console.log('🧹 Starting Database Reset...');

    // 1. Clear linked tables (Foreign Keys first)
    console.log(' - Deleting Bookings...');
    await supabase.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log(' - Deleting Room Daily Prices...');
    await supabase.from('room_daily_prices').delete().neq('id', 0); // numeric ID hack

    console.log(' - Deleting Hotel Rooms...');
    await supabase.from('hotel_rooms').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 2. Clear Services
    console.log(' - Deleting Services/Products...');
    const { error } = await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
        console.error('❌ Error clearing services:', error.message);
    } else {
        console.log('✅ Services table cleared.');
    }
};

reset();
