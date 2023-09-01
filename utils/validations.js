'use strict';

const { body } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.registerValidators = [
  body('email', 'Write correct email').isEmail().custom(async (value, {req}) => {
    try {
      const user = await User.findOne({ email: value });
      if (user) return Promise.reject('This email is in use');
    } catch (err) {
      console.log(err);  
    }
  }).normalizeEmail(),
  body('name', 'Name must have at least 3 symbols').isLength({ min :3 }).trim(),
  body('password', 'Password must have at least 6 symbols').isLength({ min: 6 }).isAlphanumeric().trim(),
  body('confirm').custom((value, {req}) => {
    if (value !== req.body.password) throw new Error('Password must be same');
    return true;
  }).trim()
];

exports.loginValidators = [
  body('email', 'No such email').isEmail().custom(async (value, {req}) => {
    try {
      const user = await User.findOne({ email: value });
      if (!user) return Promise.reject('No such email');
      return true;
    } catch (err) {
      console.log(err);
    }
  }),
  body('password').custom(async (value, {req}) => {
    const user = await User.findOne({ email: req.body.email });
    const isSame = await bcrypt.compare(value, user.password);
    if (!isSame) return Promise.reject('Incorrect password');
    return true;
  })
];