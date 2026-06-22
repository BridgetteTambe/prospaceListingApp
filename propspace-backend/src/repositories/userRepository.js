import User from '../models/User.js';



export const create = (data) => User.create(data);

export const findById = (id) => User.findById(id);

export const findByIdWithPassword = (id) => User.findById(id).select('+password');


export const findByEmailOrUsername = (loginId) =>
  User.findOne({
    $or: [{ email: loginId.toLowerCase() }, { username: loginId }],
  }).select('+password');

// Used at registration to detect a taken email/username.
export const findExisting = (email, username) =>
  User.findOne({ $or: [{ email }, { username }] });

export const save = (doc) => doc.save();
