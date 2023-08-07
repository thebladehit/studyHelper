'use strict';

const { Router } = require('express');
const router = Router();
const Subject = require('../models/subjects');

router.get('/', async (req, res) => {
  const subjects = await Subject.getAll();
  res.render('subjects', {
    title: 'Subjects page',
    subjects
  });
});

router.get('/:id', async (req, res) => {
  const subject = await Subject.getById(req.params.id);
  res.render('subject', {
    title: `${subject.shortName}`,
    subject
  });
});

module.exports = router;