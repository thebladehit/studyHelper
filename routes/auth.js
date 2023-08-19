'use strict';

const { Router } = require('express');
const router = Router();

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

router.post('/login', (req, res) => {
  req.session.isAuthenticated = true;
  res.redirect('/subjects');
});

module.exports = router;