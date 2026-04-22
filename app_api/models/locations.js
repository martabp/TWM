const mongoose = require('mongoose');

/* ===========================
   SUBDOCUMENTO: REVIEWS
=========================== */
const reviewSchema = new mongoose.Schema({
  author: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  reviewText: { type: String, required: true },
  createdOn: { type: Date, default: Date.now }
});

/* ===========================
   SUBDOCUMENTO: OPENING TIMES
=========================== */
const openingTimeSchema = new mongoose.Schema({
  days: { type: String, required: true },
  opening: String,
  closing: String,
  closed: { type: Boolean, required: true }
});

/* ===========================
   SCHEMA PRINCIPAL: LOCATION
=========================== */
const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  rating: { type: Number, default: 0, min: 0, max: 5 },
  facilities: [String],

  coords: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },

  openingTimes: [openingTimeSchema],
  reviews: [reviewSchema]
});

// Índice geoespacial correcto para GeoJSON
locationSchema.index({ coords: '2dsphere' });

/* ===========================
   EXPORTAR MODELO
=========================== */
mongoose.model('Location', locationSchema);