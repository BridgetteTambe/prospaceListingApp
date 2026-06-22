import * as propertyRepo from '../repositories/propertyRepository.js';
import ApiError from '../utils/ApiError.js';
import {
  LISTING_TYPES,
  PROPERTY_TYPES,
  PROPERTY_STATUSES,
} from '../models/Property.js';

// Controller / Service Layer — business validation, filter building, ownership rules.

// Only these fields may ever be written from a client payload (payload sanitation:
// blocks owner spoofing, timestamp tampering, or any unexpected injected keys).
const WRITABLE_FIELDS = [
  'title', 'description', 'price', 'listingType', 'propertyType',
  'bedrooms', 'bathrooms', 'area', 'location', 'images', 'status',
];

const pick = (src, keys) =>
  keys.reduce((acc, k) => {
    if (src[k] !== undefined) acc[k] = src[k];
    return acc;
  }, {});

const isNonNegativeNumber = (v) =>
  v !== '' && v !== null && !Number.isNaN(Number(v)) && Number(v) >= 0;

// Validate inbound data and throw a 400 with a precise message BEFORE any DB write.
// requireCore=true for create (all core fields needed); false for partial updates.
const validate = (data, { requireCore }) => {
  const errors = [];
  const present = (k) => data[k] !== undefined;

  if (requireCore || present('title')) {
    if (!data.title || !String(data.title).trim()) errors.push('title is required');
  }
  if (requireCore || present('description')) {
    if (!data.description || !String(data.description).trim()) errors.push('description is required');
  }
  if (requireCore || present('price')) {
    if (!isNonNegativeNumber(data.price)) errors.push('price must be a non-negative number');
  }
  if (requireCore || present('listingType')) {
    if (!LISTING_TYPES.includes(data.listingType)) {
      errors.push(`listingType must be one of: ${LISTING_TYPES.join(', ')}`);
    }
  }
  if (requireCore || present('propertyType')) {
    if (!PROPERTY_TYPES.includes(data.propertyType)) {
      errors.push(`propertyType must be one of: ${PROPERTY_TYPES.join(', ')}`);
    }
  }

  ['bedrooms', 'bathrooms', 'area'].forEach((k) => {
    if (present(k) && data[k] !== '' && !isNonNegativeNumber(data[k])) {
      errors.push(`${k} must be a non-negative number`);
    }
  });

  if (present('status') && !PROPERTY_STATUSES.includes(data.status)) {
    errors.push(`status must be one of: ${PROPERTY_STATUSES.join(', ')}`);
  }
  if (present('images') && !Array.isArray(data.images)) {
    errors.push('images must be an array of URLs');
  }

  if (errors.length) throw new ApiError(400, errors.join('; '));
};

// Translate raw query params into a Mongo filter (business/transformation logic).
const buildFilter = (q) => {
  const filter = {};
  if (q.keyword) filter.$text = { $search: q.keyword };
  if (q.city) filter['location.city'] = new RegExp(q.city, 'i');
  if (q.listingType) filter.listingType = q.listingType;
  if (q.propertyType) filter.propertyType = q.propertyType;
  if (q.status) filter.status = q.status;
  if (q.bedrooms) filter.bedrooms = { $gte: Number(q.bedrooms) };
  if (q.minPrice || q.maxPrice) {
    filter.price = {};
    if (q.minPrice) filter.price.$gte = Number(q.minPrice);
    if (q.maxPrice) filter.price.$lte = Number(q.maxPrice);
  }
  return filter;
};

export const list = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;
  const sort = query.sort || '-createdAt';
  const filter = buildFilter(query);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    propertyRepo.findWithFilter(filter, { sort, skip, limit }),
    propertyRepo.count(filter),
  ]);

  return { items, total, page, pages: Math.ceil(total / limit) || 1 };
};

export const getById = async (id) => {
  const property = await propertyRepo.findByIdPopulated(id);
  if (!property) throw new ApiError(404, 'Property not found');
  return property;
};

export const getByOwner = (ownerId) => propertyRepo.findByOwner(ownerId);

export const create = async (ownerId, body) => {
  const data = pick(body, WRITABLE_FIELDS); // sanitation: drop non-writable keys
  validate(data, { requireCore: true });    // 400 before any DB write
  const property = await propertyRepo.create({ ...data, owner: ownerId });
  return property.populate('owner', 'username name email');
};

export const update = async (id, userId, body) => {
  const property = await propertyRepo.findById(id);
  if (!property) throw new ApiError(404, 'Property not found');
  if (property.owner.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to edit this property');
  }

  const data = pick(body, WRITABLE_FIELDS); // sanitation: owner can never be reassigned
  validate(data, { requireCore: false });
  Object.assign(property, data);

  return propertyRepo.save(property);
};

export const remove = async (id, userId) => {
  const property = await propertyRepo.findById(id);
  if (!property) throw new ApiError(404, 'Property not found');
  if (property.owner.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to delete this property');
  }

  await propertyRepo.remove(property);
  return { id };
};
