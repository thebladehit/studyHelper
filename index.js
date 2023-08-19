'use strict';

require('dotenv/config');

const express = require('express');
const exhbs = require('express-handlebars');
const path = require('node:path');
const mongoose = require('mongoose');
const { PORT, URL, EMAIL, NAME } = require('./config/config');
const User = require('./models/user');

const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const subjectsRoutes = require('./routes/subjects');
const editRoutes = require('./routes/edit');
const listRoutes = require('./routes/list');
const authRoutes = require('./routes/auth');

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

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('64d5fc8f9dc7c357c28dc748');
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/subjects', subjectsRoutes);
app.use('/edit', editRoutes);
app.use('/list', listRoutes);
app.use('/auth', authRoutes);

async function start() {
  try {
    await mongoose.connect(URL, { useNewUrlParser: true });
    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        email: EMAIL,
        name: NAME,
        list: {items: []}
      });
      await user.save();
    }
    app.listen(PORT, () => {
      console.log(`Working at ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();