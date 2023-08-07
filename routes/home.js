'use strict';

const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.render('home', {
    title: 'Home page'
  });
});

module.exports = router;