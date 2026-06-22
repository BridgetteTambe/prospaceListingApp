import Property from '../models/Property.js';



export const create = (data) => Property.create(data);

export const findById = (id) => Property.findById(id);

export const findByIdPopulated = (id) =>
  Property.findById(id).populate('owner', 'username name email phone');

export const findByOwner = (ownerId) =>
  Property.find({ owner: ownerId }).sort('-createdAt');

export const findWithFilter = (filter, { sort, skip, limit }) =>
  Property.find(filter)
    .populate('owner', 'username name email')
    .sort(sort)
    .skip(skip)
    .limit(limit);

export const count = (filter) => Property.countDocuments(filter);

export const save = (doc) => doc.save();

export const remove = (doc) => doc.deleteOne();
