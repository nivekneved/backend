const supabase = require('../config/supabase');

// @desc    Signup for newsletter
// @route   POST /api/newsletter
// @access  Public
exports.newsletterSignup = async (req, res) => {
    const { email, consent } = req.body;

    try {
        if (!email || !consent) {
            return res.status(400).json({ message: 'Email and consent are required' });
        }

        const { data, error } = await supabase
            .from('newsletter_subscribers')
            .upsert({ email, consent, subscribed_at: new Date().toISOString() }, { onConflict: 'email' })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ message: 'Subscribed successfully', data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit general feedback
// @route   POST /api/feedback
// @access  Public
exports.submitFeedback = async (req, res) => {
    const { name, email, rating, comment, consent } = req.body;

    try {
        if (!rating || !consent) {
            return res.status(400).json({ message: 'Rating and consent are required' });
        }

        const { data, error } = await supabase
            .from('feedback')
            .insert([{
                name: name || 'Anonymous',
                email,
                rating,
                comment,
                consent,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ message: 'Feedback submitted', data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit contact form inquiry
// @route   POST /api/contact
// @access  Public
exports.submitContactForm = async (req, res) => {
    const { name, email, message } = req.body;
    const notificationService = require('../utils/notificationService');

    try {
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Name, email, and message are required' });
        }

        // Send email to admin
        const emailBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #DC2626;">New Contact Form Submission</h2>
                <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <p><strong>From:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                </div>
                <div style="background: white; padding: 20px; border-left: 4px solid #DC2626;">
                    <p><strong>Message:</strong></p>
                    <p style="line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
                </div>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 12px;">
                    This message was sent via the Travel Lounge contact form.
                </p>
            </div>
        `;

        await notificationService.sendEmail(
            'reservation@travellounge.mu',
            `Contact Form: ${name}`,
            emailBody
        );

        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ message: 'Failed to send message. Please try again.' });
    }
};
// @desc    Log frontend errors
// @route   POST /api/misc/logs
// @access  Public
exports.logFrontendError = async (req, res) => {
    const { error, info, app } = req.body;

    try {
        const { error: insertError } = await supabase.from('audit_logs').insert([{
            action: 'FRONTEND_ERROR',
            target_type: app || 'UNKNOWN',
            details: {
                errorMessage: error,
                errorInfo: info,
                url: req.get('referer'),
                user_agent: req.get('user-agent')
            }
        }]);

        if (insertError) throw insertError;

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Failed to log frontend error:', err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
