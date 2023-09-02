'use strict';

const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.render('profile', {
    title: 'Profile',
    isProfile: true
  });
});

module.exports = router;