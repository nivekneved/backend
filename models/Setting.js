const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    description: String,
    category: {
        type: String,
        enum: ['api', 'notification', 'compliance', 'general'],
        default: 'general'
    },
    updatedAt: { type: Date, default: Date.now }
});

settingSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Setting', settingSchema);
