'use strict';

const { Router } = require('express');
const router = Router();
// const List = require('../models/list');
const Subject = require('../models/subjects');

router.get('/', async (req, res) => {
  // const list = await List.getAll();
  res.render('list', {
    title: 'Your subjecs',
    list,
    isList: true
  });
});

router.post('/add', async (req, res) => {
  const subject = await Subject.getById(req.body.id);
  await List.add(subject);
  res.redirect('/list');
});

router.delete('/delete/:id', async (req, res) => {
  const newList = await List.delete(req.params.id);
  res.end(JSON.stringify(newList));
});

module.exports = router;