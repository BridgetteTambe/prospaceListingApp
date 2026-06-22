// Single source of truth for which user fields are safe to expose.
export const publicUser = (u) => ({
  _id: u._id,
  username: u.username,
  name: u.name,
  email: u.email,
  phone: u.phone,
  avatar: u.avatar,
  role: u.role,
});
