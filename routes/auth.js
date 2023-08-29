'use strict';

const { Router } = require('express');
const router = Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const nodemailer = require('nodemailer');
const { EMAIL, PASS } = require('../config/config');
const regEmail = require('../emails/registration');

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


module.exports = router;