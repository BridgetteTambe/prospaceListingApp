import express from 'express';
import {
  getProperties,
  getPropertyById,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getProperties);

// Protected dashboard route — declared before '/:id' so it isn't captured as an id
router.get('/mine/list', protect, getMyProperties);

router.post('/', protect, createProperty);

router.get('/:id', getPropertyById);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

export default router;
