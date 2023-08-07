'use strict';

const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.render('add', {
    title: 'Add page',
  })
});

router.post('/', (req, res) => {
  console.log(req.body);
});

module.exports = router;