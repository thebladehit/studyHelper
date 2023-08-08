'use strict';

const { Router } = require('express');
const router = Router();
const Subject = require('../models/subjects');

router.get('/:id', async (req, res) => {
  const subject = await Subject.getById(req.params.id);
  res.render('edit', {
    title: `Edit ${subject.shortName}`,
    subject
  });
});

router.post('/:id', async (req, res) => {
  await Subject.update(req.body);
  res.redirect(`/subjects/${req.body.id}`);
});

module.exports = router;