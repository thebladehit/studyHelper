'use strict';

const express = require('express');
const exhbs = require('express-handlebars');
const path = require('node:path');

const homeRoutes = require('./routes/home');

const PORT = process.env.PORT || 3001;
const hbs = exhbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

const app = express();

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', homeRoutes);

app.listen(PORT, () => {
  console.log(`Working at ${PORT}`);
});