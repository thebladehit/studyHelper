'use strict';

const { Router } = require('express');
const router = Router();
const Subject = require('../models/subjects');
const auth = require('../middleware/auth');

const mapList = (list) => {
  return list.items.map(item => ({
    name: item.subjectId.name,
    teacher:item.subjectId.teacher,
    shortName: item.subjectId.shortName,
    id: item.subjectId._id
  }));
};

router.get('/', auth, async (req, res) => {
  const user = await req.user.populate('list.items.subjectId');
  res.render('list', {
    title: 'Your subjecs',
    list: mapList(user.list),
    isList: true
  });
});

router.post('/add', auth, async (req, res) => {
  const subject = await Subject.findById(req.body.id);
  await req.user.addToList(subject);
  res.redirect('/list');
});

router.delete('/delete/:id', auth, async (req, res) => {
  await req.user.removeFromList(req.params.id);
  const user = await req.user.populate('list.items.subjectId');
  res.end(JSON.stringify({list: mapList(user.list), csrfToken: res.locals.csrf}));
});

module.exports = router;