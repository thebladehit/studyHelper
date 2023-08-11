'use strict';

const { Router } = require('express');
const router = Router();
const Subject = require('../models/subjects');

router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    res.render('edit', {
      title: `Edit ${subject.shortName}`,
      subject
    });
  } catch (err) {
    console.log(err);
  }
});

router.post('/:id', async (req, res) => {
  try {
    const { id } = req.body;
    delete req.body.id;
    await Subject.findByIdAndUpdate(id, req.body);
    res.redirect(`/subjects/${id}`);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;