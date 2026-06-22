import * as authService from '../services/authService.js';

// Controller layer — HTTP only: read req, call service, send response.

export const register = async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
};

export const login = async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
};

export const getMe = async (req, res) => {
  res.json(authService.getProfile(req.user));
};
