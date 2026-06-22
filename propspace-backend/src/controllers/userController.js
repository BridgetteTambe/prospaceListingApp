import * as userService from '../services/userService.js';



export const updateProfile = async (req, res) => {
  const result = await userService.updateProfile(req.user._id, req.body);
  res.json(result);
};

export const changePassword = async (req, res) => {
  const result = await userService.changePassword(req.user._id, req.body);
  res.json(result);
};
