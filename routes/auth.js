'use strict';

const { Router } = require('express');
const router = Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const { EMAIL, PASS } = require('../config/config');
const { registerValidators, loginValidators, resetEmailValidation, resetPassValidation } = require('../utils/validations');
const regEmail = require('../emails/registration');
const resetEmail = require('../emails/reset');

const transpoerter = nodemailer.createTransport({
  host: 'smtp.ukr.net',
  port: 465,
  auth: {
    user: EMAIL,
    pass: PASS,
  }
});

router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError'),
    email: req.flash('email'),
    name: req.flash('name'),
    password: req.flash('password'),
    confirm: req.flash('confirm')
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

router.post('/login', loginValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      req.flash('loginError', errors.array()[0].msg);
      return res.status(422).redirect('/auth/login#login');
    }

    const user = await User.findOne({ email: req.body.email });
    req.session.user = user;
    req.session.isAuthenticated = true;
    req.session.save(err => {
      if (err) throw err;
      req.flash('loginError', 'Something went wrong');      
      res.redirect('/subjects');
    });
  } catch (err) {
    console.log(err);
  }
});

router.post('/register', registerValidators, async (req, res) => {
  try {
    const { email, name, password, confirm } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      req.flash('email', email);
      req.flash('name', name);
      req.flash('password', password);
      req.flash('confirm', confirm);
      req.flash('registerError', errors.array()[0].msg);
      return res.status(422).redirect('/auth/login#register');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, name, password: hashPassword, cart: {items: []} });
    await user.save();
    res.redirect('/auth/login#login');
    await transpoerter.sendMail(regEmail(email));
  } catch (err) {
    console.log(err); 
  }
});

router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    title: 'Forgot password',
    error: req.flash('error')
  });
});

router.post('/reset', resetEmailValidation, (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.status(422).redirect('/auth/reset');
    }
    
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Something went wrong!');
        return res.redirect('/auth/reset');
      }
      const token = buffer.toString('hex');
      const candidate = await User.findOne({ email: req.body.email });
      candidate.resetToken = token;
      candidate.resetTokenExp = Date.now() + 3600 * 1000;
      await candidate.save();
      res.redirect('/auth/login');
      await transpoerter.sendMail(resetEmail(candidate.email, token));
    });
  } catch (err) {
    console.log(err);
  }
});

router.get('/password/:token', async (req, res) => {
  if (!req.params.token) {
    return res.redirect('/auth/login');
  }

  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() }
    });
    if (!user) return res.redirect('/auth/login');
    res.render('auth/password', {
      title: 'Reset access',
      error: req.flash('error'),
      userId: user._id.toString(),
      token: req.params.token
    });
  } catch (err) {
    console.log(err);
  }
});

router.post('/password', resetPassValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.status(422).redirect(`/auth/password/${req.body.token}`);
    }

    const user = await User.findById(req.body.userId);
    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetToken = undefined;
    user.resetTokenExp = undefined;
    await user.save();
    res.redirect('/auth/login');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;