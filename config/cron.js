const cron = require('node-cron');
const supabase = require('./supabase');

// Run every day at midnight
const initCronJobs = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('Running Data Retention Cleanup (GDPR)...');
        try {
            const twelveMonthsAgo = new Date();
            twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
            const dateStr = twelveMonthsAgo.toISOString();

            // Auto-delete bookings older than 12 months as per requirements
            const { data, error, count } = await supabase
                .from('bookings')
                .delete({ count: 'exact' })
                .lt('created_at', dateStr);

            if (error) throw error;

            console.log(`GDPR Cleanup: Deleted ${count} old bookings.`);
        } catch (error) {
            console.error('GDPR Cleanup Error:', error);
        }
    });

    // Pre-Travel Reminder: Run daily at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
        console.log('Running Pre-Travel Reminder Job...');
        try {
            const fiveDaysFromNow = new Date();
            fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);
            const targetDate = fiveDaysFromNow.toISOString().split('T')[0];

            // Query bookings with check-in in 5 days
            const { data: upcomingBookings, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    services:service_id(name, type, description)
                `)
                .eq('status', 'confirmed')
                .filter('booking_details->>checkIn', 'eq', targetDate);

            if (error) throw error;

            const count = upcomingBookings?.length || 0;
            console.log(`Found ${count} trips departing in 5 days`);

            // Send reminder emails
            const notificationService = require('../utils/notificationService');

            for (const booking of upcomingBookings || []) {
                const checkInDate = new Date(booking.booking_details.checkIn);
                const formattedDate = checkInDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                const emailBody = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #DC2626; margin-bottom: 10px;">Your Adventure Awaits! 🌴</h2>
                        <p style="font-size: 16px; color: #374151;">Hello ${booking.customer.name},</p>
                        <p style="color: #6b7280;">This is a friendly reminder that your trip is just <strong style="color: #DC2626;">5 days away</strong>!</p>
                        
                        <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin: 20px 0;">
                            <h3 style="color: #1f2937; margin-top: 0;">📋 Your Booking Details</h3>
                            <ul style="list-style: none; padding: 0; color: #374151;">
                                <li style="padding: 8px 0;"><strong>Package:</strong> ${booking.services?.name || 'N/A'}</li>
                                <li style="padding: 8px 0;"><strong>Check-in:</strong> ${formattedDate}</li>
                                <li style="padding: 8px 0;"><strong>Check-out:</strong> ${booking.booking_details.checkOut || 'N/A'}</li>
                            </ul>
                        </div>

                        <div style="background: #fef2f2; border-left: 4px solid #DC2626; padding: 20px; margin: 20px 0;">
                            <h3 style="color: #991b1b; margin-top: 0;">✅ Important Reminders</h3>
                            <ul style="color: #7f1d1d; line-height: 1.8;">
                                <li>Bring your booking confirmation (print or digital)</li>
                                <li>Valid ID or Passport required</li>
                                <li>Check local weather forecast before packing</li>
                                <li>Arrive 15 minutes early for check-in</li>
                            </ul>
                        </div>

                        <div style="background: #ecfdf5; padding: 20px; border-radius: 10px; text-align: center; margin: 30px 0;">
                            <h3 style="color: #065f46; margin-top: 0;">Need Assistance?</h3>
                            <p style="color: #047857; margin: 10px 0;">📧 <a href="mailto:reservation@travellounge.mu" style="color: #DC2626; text-decoration: none;">reservation@travellounge.mu</a></p>
                            <p style="color: #047857; margin: 10px 0;">📞 <a href="tel:+2302124070" style="color: #DC2626; text-decoration: none;">+230 212 4070</a></p>
                            <p style="color: #065f46; font-size: 14px; margin-top: 15px;">Mon-Fri: 08:30-16:45</p>
                        </div>

                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                        
                        <p style="color: #374151; font-size: 16px;">We look forward to making your Mauritius experience unforgettable!</p>
                        <p style="color: #DC2626; font-weight: bold; font-size: 16px;">The Travel Lounge Team</p>
                        
                        <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
                            This is an automated reminder for your upcoming booking. 
                            You are receiving this email because you have a confirmed reservation with Travel Lounge.
                        </p>
                    </div>
                `;

                await notificationService.sendEmail(
                    booking.customer.email,
                    `🌴 Your ${booking.services?.name || 'Trip'} - 5 Days to Go!`,
                    emailBody
                );

                console.log(`✅ Reminder sent to ${booking.customer.email}`);
            }

        } catch (error) {
            console.error('Pre-Travel Reminder Error:', error);
        }
    });
};

module.exports = initCronJobs;
