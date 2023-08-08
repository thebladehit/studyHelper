'use strict';

const express = require('express');
const exhbs = require('express-handlebars');
const path = require('node:path');

const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const subjectsRoutes = require('./routes/subjects');
const editRoutes = require('./routes/edit');

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
app.use(express.urlencoded({ extended: true }));
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/subjects', subjectsRoutes);
app.use('/edit', editRoutes);

app.listen(PORT, () => {
  console.log(`Working at ${PORT}`);
});