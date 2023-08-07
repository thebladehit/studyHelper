'use strict';

const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.end('Hello');
});

module.exports = router;