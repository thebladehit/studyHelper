'use strict';

const { Router } = require('express');
const router = Router();
const User = require('../models/user');

router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    isLogin: true
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
      const isSame = password === candidate.password;
      if (isSame) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save(err => {
          if (err) throw err;
          res.redirect('/subjects');
        });
      } else {
        res.redirect('/auth/login#login');
      }
    } else {
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
      res.redirect('/auth/login#register');
    } else {
      const user = new User({ email, name, password, list: {items: []}});
      await user.save();
      res.redirect('/auth/login#login');
    }
  } catch (err) {
    console.log(err); 
  }
});

module.exports = router;