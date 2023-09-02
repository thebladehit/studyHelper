'use strict';

const { Router } = require('express');
const router = Router();
const Subject = require('../models/subjects');
const auth = require('../middleware/auth');
const { validationResult } = require('express-validator');
const { subjectValidation } = require('../utils/validations');

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Add page',
    isAdd: true
  })
});

router.post('/', auth, subjectValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('add', {
        title: 'Add page',
        isAdd: true,
        error: errors.array()[0].msg,
        data: {
          name: req.body.name,
          teacher: req.body.teacher,
          shortName: req.body.shortName
        }
      });
    }
  
    const subject = new Subject({
      name: req.body.name,
      teacher: req.body.teacher,
      shortName: req.body.shortName
    });

    await subject.save();
    res.redirect('/subjects');
  } catch (err) {
    console.log(err)
  }
});

module.exports = router;