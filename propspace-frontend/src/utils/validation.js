// Pure validation functions. Each returns an { field: message } map;
// an empty object means valid. Forms call these BEFORE hitting the API.

const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v);
const isHttpUrl = (v) => /^https?:\/\/\S+$/i.test(v);
const isNonNegativeNumber = (v) => v !== '' && !Number.isNaN(Number(v)) && Number(v) >= 0;

export const hasErrors = (errors) => Object.keys(errors).length > 0;

export function validateRegister(f) {
  const e = {};
  if (!f.username.trim()) e.username = 'Username is required';
  else if (f.username.trim().length < 3) e.username = 'Must be at least 3 characters';
  else if (!/^[a-zA-Z0-9_]+$/.test(f.username)) e.username = 'Letters, numbers and underscores only';

  if (!f.email.trim()) e.email = 'Email is required';
  else if (!isEmail(f.email)) e.email = 'Enter a valid email address';

  if (!f.password) e.password = 'Password is required';
  else if (f.password.length < 6) e.password = 'Must be at least 6 characters';

  return e;
}

export function validateLogin(f) {
  const e = {};
  if (!f.identifier.trim()) e.identifier = 'Enter your email or username';
  if (!f.password) e.password = 'Enter your password';
  return e;
}

export function validateProperty(f) {
  const e = {};
  if (!f.title.trim()) e.title = 'Title is required';
  if (!f.description.trim()) e.description = 'Description is required';

  if (f.price === '' || f.price === null) e.price = 'Price is required';
  else if (!isNonNegativeNumber(f.price)) e.price = 'Enter a valid, non-negative price';

  if (f.bedrooms !== '' && !isNonNegativeNumber(f.bedrooms)) e.bedrooms = 'Must be a number';
  if (f.bathrooms !== '' && !isNonNegativeNumber(f.bathrooms)) e.bathrooms = 'Must be a number';
  if (f.area !== '' && !isNonNegativeNumber(f.area)) e.area = 'Must be a number';

  const urls = (f.images || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (urls.some((u) => !isHttpUrl(u))) e.images = 'Each image must be a valid http(s) URL';

  return e;
}

export function validatePasswordChange(f) {
  const e = {};
  if (!f.currentPassword) e.currentPassword = 'Enter your current password';
  if (!f.newPassword) e.newPassword = 'Enter a new password';
  else if (f.newPassword.length < 6) e.newPassword = 'Must be at least 6 characters';
  return e;
}
