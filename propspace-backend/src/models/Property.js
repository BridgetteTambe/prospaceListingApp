import mongoose from 'mongoose';

// Exported so the service layer validates against the SAME source of truth
// as the schema (prevents enum drift between validation and the model).
export const LISTING_TYPES = ['rent', 'sale'];
export const PROPERTY_TYPES = ['apartment', 'house', 'studio'];
export const PROPERTY_STATUSES = ['available', 'pending', 'sold', 'rented'];

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    listingType: { type: String, enum: LISTING_TYPES, required: true },
    propertyType: { type: String, enum: PROPERTY_TYPES, required: true },
    bedrooms: { type: Number, default: 0, min: 0 },
    bathrooms: { type: Number, default: 0, min: 0 },
    area: { type: Number, min: 0 }, // square meters/feet
    location: {
      address: { type: String, default: '' },
      city: { type: String, default: '', index: true },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    images: [{ type: String }],
    status: { type: String, enum: PROPERTY_STATUSES, default: 'available' },
    // Reference linking each listing to its owning user account.
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // "My Listings" queries filter by owner
    },
  },
  { timestamps: true }
);

// Full-text search across title + description (used by the keyword filter)
propertySchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Property', propertySchema);
