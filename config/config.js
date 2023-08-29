'use strict';

const PORT = process.env.PORT ?? 3001;
const URL = process.env.URL;
const EMAIL = process.env.EMAIL;
const PASS = process.env.PASS;
const ID = process.env.ID; 
const BASE_URL = process.env.BASE_URL;
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
  PORT,
  URL,
  EMAIL,
  PASS,
  ID,
  BASE_URL,
  SECRET_KEY
};