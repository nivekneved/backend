const nodemailer = require('nodemailer');
const supabase = require('../config/supabase');

class NotificationService {
    async sendEmail(to, subject, body) {
        try {
            // Fetch configuration from Settings table
            const { data: settings } = await supabase
                .from('settings')
                .select('*')
                .in('key', ['EMAIL_HOST', 'EMAIL_USER', 'EMAIL_PASS']);

            const config = {};
            settings?.forEach(s => config[s.key] = s.value);

            if (!config.EMAIL_HOST || !config.EMAIL_USER || !config.EMAIL_PASS) {
                console.log('--- EMAIL SIMULATION ---');
                console.log(`To: ${to}`);
                console.log(`Subject: ${subject}`);
                console.log(`Body: ${body}`);
                return true;
            }

            const transporter = nodemailer.createTransport({
                host: config.EMAIL_HOST,
                port: 587,
                secure: false,
                auth: { user: config.EMAIL_USER, pass: config.EMAIL_PASS }
            });

            await transporter.sendMail({
                from: '"Travel Lounge Mauritius" <noreply@travellounge.mu>',
                to,
                subject,
                html: body
            });
            return true;
        } catch (error) {
            console.error('Email error:', error);
            return false;
        }
    }

    async sendSMS(to, message) {
        // Similar logic for Twilio integration via Settings table
        console.log(`--- SMS SIMULATION to ${to} ---`);
        console.log(message);
        return true;
    }

    /**
     * Notify about significant price drops
     * @param {Object} params - Notification parameters
     * @param {number} params.productId - ID of the product
     * @param {string} params.productName - Name of the product
     * @param {number} params.oldPrice - Previous price
     * @param {number} params.newPrice - New price
     */
    async notifyPriceDrop({ productId, productName, oldPrice, newPrice }) {
        try {
            // Format the notification message
            const message = `PRICE DROP ALERT for ${productName}: ${oldPrice} -> ${newPrice}`;
            console.log(message);
            
            // Store the price drop in a structured format
            const changePercentage = ((oldPrice - newPrice) / oldPrice * 100).toFixed(2);
            
            const { error } = await supabase
                .from('notifications')
                .insert([{
                    type: 'PRICE_DROP',
                    title: `Price Drop: ${productName}`,
                    content: `The price of ${productName} dropped from ${oldPrice} to ${newPrice}`,
                    metadata: {
                        productId,
                        productName,
                        oldPrice,
                        newPrice,
                        changePercentage
                    },
                    created_at: new Date().toISOString()
                }]);
            
            if (error) {
                console.error('Failed to save price drop notification:', error.message);
            }
            
            // In a real implementation, you would also send notifications 
            // via email, push notification, or SMS here
            
            return { success: true, message };
        } catch (error) {
            console.error('Error in price drop notification:', error.message);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new NotificationService();
