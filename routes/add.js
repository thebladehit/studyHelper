'use strict';

const { Router } = require('express');
const router = Router();
const Subject = require('../models/subjects');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Add page',
    isAdd: true
  })
});

router.post('/', auth, async (req, res) => {
  const subject = new Subject({
    name: req.body.name,
    teacher: req.body.teacher,
    shortName: req.body.shortName
  });

  try {
    await subject.save();
    res.redirect('/subjects');
  } catch (err) {
    console.log(err)
  }
});

module.exports = router;