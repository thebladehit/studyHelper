'use strict';

const { BASE_URL, EMAIL } = require('../config/config');

module.exports = (email) => {
  return {
    to: email,
    from: EMAIL,
    subject: 'Accaunt created',
    html: `
      <h1>Welcome to Study helper</h1>
      <p>Account was created successfully</p>
      <hr/>
      <a href="${BASE_URL}">Our web-site</a>
    `
  };
};