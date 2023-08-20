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
  const user = await User.findById('64d5fc8f9dc7c357c28dc748');
  req.session.user = user;
  req.session.isAuthenticated = true;
  req.session.save(err => {
    if (err) throw err;
    res.redirect('/subjects');
  });
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