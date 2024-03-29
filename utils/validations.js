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

exports.subjectValidation = [
  body('name', 'Name must have at least 6 symbols').isLength({ min: 6 }).trim(),
  body('teacher', 'Teacher must have at least 4 symbols').isLength({ min: 4 }).trim(),
  body('shortName', 'Short name must have at least 2 symbols').isLength({ min: 2 }).trim()
];

exports.resetEmailValidation = [
  body('email', 'Write correct email').isEmail().custom(async (value, {req}) => {
    try {
      const user = await User.findOne({ email: value });
      if (!user) return Promise.reject('No such email');
      return true;
    } catch (err) {
      console.log(err);
    }
  })
];

exports.resetPassValidation = [
  body('password', 'Password must have at least 6 symbols').isLength({ min: 6 }).isAlphanumeric().custom(async (value, {req}) => {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() }
    });
    if (!user) return Promise.reject('The token has expired!');
    return true;
  }).trim()
];