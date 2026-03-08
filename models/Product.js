const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: [
      'flights', 'hotels', 'group-tours', 'coach-tours', 
      'ready-made-packages', 'honeymoon-wedding', 'excursions', 
      'airport-transfers', 'land-sea-activities', 'cruises', 
      'local-deals', 'tailor-made'
    ] 
  },
  images: [String],
  pricing: {
    basePrice: Number,
    weekdayPrice: Number,
    weekendPrice: Number,
    currency: { type: String, default: 'MUR' }
  },
  inventory: {
    totalQuantity: Number,
    availableQuantity: Number,
    stopSale: { type: Boolean, default: false },
    minBookingDays: { type: Number, default: 1 }
  },
  hotelDetails: {
    roomType: String,
    amenities: [String]
  },
  tourDetails: {
    itinerary: [String],
    duration: String,
    inclusion: [String],
    exclusion: [String]
  },
  location: String,
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
