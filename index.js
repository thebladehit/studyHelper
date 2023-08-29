'use strict';

require('dotenv/config');

const express = require('express');
const exhbs = require('express-handlebars');
const path = require('node:path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const { PORT, URL, SECRET_KEY } = require('./config/config');
const User = require('./models/user');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

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

const store = new MongoStore({
  collection: 'sessions',
  uri: URL
});

const app = express();

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store,
}));
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);
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
    app.listen(PORT, () => {
      console.log(`Working at ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();