import * as userRepo from '../repositories/userRepository.js';
import ApiError from '../utils/ApiError.js';
import { publicUser } from '../utils/userView.js';

// Controller / Service Layer — business validation & transformations.

export const updateProfile = async (userId, { name, phone, avatar }) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (avatar !== undefined) user.avatar = avatar;

  const updated = await userRepo.save(user);
  return publicUser(updated);
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current and new password are required');
  }
  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters');
  }

  const user = await userRepo.findByIdWithPassword(userId);
  if (!user || !(await user.matchPassword(currentPassword))) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  user.password = newPassword; // re-hashed by the model's pre-save hook
  await userRepo.save(user);
  return { message: 'Password updated successfully' };
};
