import * as propertyService from '../services/propertyService.js';

// Controller layer — HTTP + transport (socket emits). No business logic here.

export const getProperties = async (req, res) => {
  res.json(await propertyService.list(req.query));
};

export const getPropertyById = async (req, res) => {
  res.json(await propertyService.getById(req.params.id));
};

export const getMyProperties = async (req, res) => {
  res.json(await propertyService.getByOwner(req.user._id));
};

export const createProperty = async (req, res) => {
  const property = await propertyService.create(req.user._id, req.body);
  req.app.get('io').emit('property:new', property);
  res.status(201).json(property);
};

export const updateProperty = async (req, res) => {
  const property = await propertyService.update(req.params.id, req.user._id, req.body);
  req.app.get('io').emit('property:updated', property);
  res.json(property);
};

export const deleteProperty = async (req, res) => {
  const result = await propertyService.remove(req.params.id, req.user._id);
  req.app.get('io').emit('property:deleted', result);
  res.json({ message: 'Property removed' });
};
