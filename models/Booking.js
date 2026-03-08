const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customer: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    bookingDetails: {
        startDate: Date,
        endDate: Date,
        guests: {
            adults: Number,
            children: Number
        },
        message: String
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected', 'cancelled'],
        default: 'pending'
    },
    consent: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

bookingSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
