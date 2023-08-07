'use strict';

const express = require('express');
const homeRoutes = require('./routes/home');

const PORT = process.env.PORT || 3001;

const app = express();

app.use('/', homeRoutes);

app.listen(PORT, () => {
  console.log(`Working at ${PORT}`);
});