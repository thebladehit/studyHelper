'use strict';

const { Router } = require('express');
const router = Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const nodemailer = require('nodemailer');
const { EMAIL, PASS } = require('../config/config');
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
    registerError: req.flash('registerError')
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      const isSame = await bcrypt.compare(password, candidate.password);
      if (isSame) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save(err => {
          if (err) throw err;
          req.flash('loginError', 'Something went wrong');      
          res.redirect('/subjects');
        });
      } else {
        req.flash('loginError', 'Incorrect password');
        res.redirect('/auth/login#login');
      }
    } else {
      req.flash('loginError', 'No such user');
      res.redirect('/auth/login#login');
    }
  } catch (err) {
    console.log(err);
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, name, password, confirm } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      req.flash('registerError', 'This email is not available');
      res.redirect('/auth/login#register');
    } else {
      if (password !== confirm) {
        req.flash('registerError', 'Passwords are not same');
        res.redirect('/auth/login#register');
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, name, password: hashPassword, list: {items: []}});
        await user.save();
        res.redirect('/auth/login#login');
        await transpoerter.sendMail(regEmail(email));
      }
    }
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

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Something went wrong!');
        return res.redirect('/auth/reset');
      }

      const token = buffer.toString('hex');
      const candidate = await User.findOne({ email: req.body.email });

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 3600 * 1000;
        await candidate.save();
        res.redirect('/auth/login');
        await transpoerter.sendMail(resetEmail(candidate.email, token));
      } else {
        req.flash('error', 'There is not such email');
        res.redirect('/auth/reset');
      }
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

router.post('/password', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() }
    });
    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save();
      res.redirect('/auth/login');
    } else {
      req.flash('error', 'The token has expired!');
      res.redirect('/auth/login');
    }
    
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;