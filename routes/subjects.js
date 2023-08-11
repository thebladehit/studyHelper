'use strict';

const { Router } = require('express');
const router = Router();
const Subject = require('../models/subjects');

router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.render('subjects', {
      title: 'Subjects page',
      isSubjects: true,
      subjects
    });
  } catch (err) {
    console.log(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    res.render('subject', {
      title: `${subject.shortName}`,
      subject
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;