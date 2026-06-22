import * as userRepo from '../repositories/userRepository.js';
import generateToken from '../utils/generateToken.js';
import ApiError from '../utils/ApiError.js';
import { publicUser } from '../utils/userView.js';

// Controller / Service Layer — business validation & transformations.

export const register = async ({ username, email, password, name, phone }) => {
  if (!username || !email || !password) {
    throw new ApiError(400, 'Username, email, and password are required');
  }

  const existing = await userRepo.findExisting(email.toLowerCase(), username);
  if (existing) {
    const field = existing.email === email.toLowerCase() ? 'email' : 'username';
    throw new ApiError(400, `That ${field} is already registered`);
  }

  const user = await userRepo.create({ username, email, password, name, phone });
  return { ...publicUser(user), token: generateToken(user._id) };
};

export const login = async ({ identifier, email, password }) => {
  const loginId = identifier || email; // accept either field name from the client
  if (!loginId || !password) {
    throw new ApiError(400, 'Email/username and password are required');
  }

  const user = await userRepo.findByEmailOrUsername(loginId);
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }

  return { ...publicUser(user), token: generateToken(user._id) };
};

export const getProfile = (user) => publicUser(user);
