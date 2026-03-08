/**
 * Validates and formats the itinerary object for storage
 * @param {Array} itinerary - Array of day objects
 * @returns {Array} - Cleaned itinerary array
 */
exports.formatItinerary = (itinerary) => {
    if (!Array.isArray(itinerary)) return [];

    return itinerary.map((day, index) => ({
        day: index + 1,
        title: day.title?.trim() || `Day ${index + 1}`,
        description: day.description?.trim() || '',
        activities: Array.isArray(day.activities) ? day.activities.map(act => ({
            time: act.time || '09:00',
            description: act.description?.trim() || 'Free time'
        })) : []
    }));
};
