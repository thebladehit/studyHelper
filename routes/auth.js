'use strict';

const { Router } = require('express');
const router = Router();

router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: 'Login',
  });
});

module.exports = router;