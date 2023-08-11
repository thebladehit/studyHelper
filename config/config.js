'use strict';

const PORT = process.env.PORT ?? 3001;
const URL = process.env.URL;
const EMAIL = process.env.EMAIL ?? 'someemail@some.com';
const NAME = process.env.NAME ?? 'noname';
const ID = process.env.ID; 

module.exports = {
  PORT,
  URL,
  EMAIL,
  NAME,
  ID
};