'use strict';

const { Router } = require('express');
const router = Router();
const Subject = require('../models/subjects');

router.get('/', (req, res) => {
  res.render('add', {
    title: 'Add page',
  })
});

router.post('/', async (req, res) => {
  console.log(req.body);
  const subject = new Subject(req.body.name, req.body.teacher, req.body.shortName);
  await subject.add();
  res.redirect('/subjects');
});

module.exports = router;