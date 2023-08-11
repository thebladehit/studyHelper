'use strict';

require('dotenv/config');

const express = require('express');
const exhbs = require('express-handlebars');
const path = require('node:path');
const mongoose = require('mongoose');
const { PORT, URL } = require('./config/config');

const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const subjectsRoutes = require('./routes/subjects');
const editRoutes = require('./routes/edit');
const listRoutes = require('./routes/list');

const hbs = exhbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  } 
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
app.use('/list', listRoutes);

async function start() {
  try {
    await mongoose.connect(URL, { useNewUrlParser: true });
    app.listen(PORT, () => {
      console.log(`Working at ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();