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

module.exports = router;