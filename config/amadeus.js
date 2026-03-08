const Amadeus = require('amadeus');
const supabase = require('./supabase');

const getAmadeusClient = async () => {
    // In a real scenario, these would be in .env
    // For this simulation, we fetch from Settings table if available, else use env
    const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .in('key', ['AMADEUS_CLIENT_ID', 'AMADEUS_CLIENT_SECRET']);

    const config = {};
    settings?.forEach(s => config[s.key] = s.value);

    return new Amadeus({
        clientId: config.AMADEUS_CLIENT_ID || process.env.AMADEUS_CLIENT_ID,
        clientSecret: config.AMADEUS_CLIENT_SECRET || process.env.AMADEUS_CLIENT_SECRET
    });
};

module.exports = getAmadeusClient;
