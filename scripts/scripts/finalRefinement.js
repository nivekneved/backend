const supabase = require('../backend/config/supabase');

const runFinalRefinement = async () => {
    try {
        console.log('--- Final Category Standardization ---');

        // Map everything accurately
        const seaKeywords = ['Catamaran', 'Cruise', 'Undersea', 'Dolphin', 'Parasailing', 'Scuba', 'Water', 'Boat'];
        const landKeywords = ['Seven Coloured', 'South Tour', 'Zip Line', 'Hiking', 'Quad', 'Safari', 'Island Tour'];

        const { data: services, error: fetchErr } = await supabase.from('services').select('id, name');
        if (fetchErr) throw fetchErr;

        for (const service of services) {
            let newCat = null;
            if (seaKeywords.some(k => service.name.includes(k))) {
                newCat = 'Sea Activities';
            } else if (landKeywords.some(k => service.name.includes(k))) {
                newCat = 'Land Activities';
            }

            if (newCat) {
                await supabase.from('services').update({ category: newCat, type: 'activity' }).eq('id', service.id);
            }
        }

        // Fix Day Packages category and type
        await supabase.from('services').update({ category: 'Day Packages', type: 'day-package' }).ilike('name', '%Day%');
        await supabase.from('services').update({ category: 'Day Packages', type: 'day-package' }).ilike('description', '%Day Pass%');

        console.log('--- Final Data Enrichment ---');

        const enrichmentData = {
            'Sunset Catamaran Cruise': {
                itinerary: [
                    { time: '16:00', activity: 'Boarding at Grand Baie' },
                    { time: '16:30', activity: 'Sailing along the north coast' },
                    { time: '17:30', activity: 'Sunset viewing with cocktails' },
                    { time: '18:30', activity: 'Return to Grand Baie' }
                ],
                inclusions: ['Snacks', 'Unlimited Drinks', 'Live Music', 'Expert Crew']
            },
            'Seven Coloured Earth Tour': {
                itinerary: [
                    { time: '09:00', activity: 'Pick up from hotel' },
                    { time: '10:30', activity: 'Visit Chamarel Seven Coloured Earth' },
                    { time: '11:30', activity: 'Chamarel Waterfall viewing' },
                    { time: '12:30', activity: 'Rum Distillery tour and tasting' }
                ],
                inclusions: ['Private Transport', 'Entrance Fees', 'Rum Tasting', 'Professional Guide']
            }
        };

        for (const [name, data] of Object.entries(enrichmentData)) {
            await supabase.from('services').update(data).ilike('name', name);
        }

        console.log('--- Hotel Room Policies ---');
        const standardPolicies = ['No smoking in rooms', 'Check-out: 11:00 AM', 'No pets', 'Quiet hours after 10 PM'];
        const cancellation = 'Full refund 48h prior.';
        const deposit = '20% deposit required.';

        const { data: rooms } = await supabase.from('hotel_rooms').select('id');
        for (const room of rooms) {
            await supabase.from('hotel_rooms').update({
                policies: standardPolicies,
                cancellation_policy: cancellation,
                deposit_policy: deposit
            }).eq('id', room.id);
        }

        console.log('Refinement complete.');
        process.exit(0);
    } catch (err) {
        console.error('Refinement failed:', err.message);
        process.exit(1);
    }
};

runFinalRefinement();
