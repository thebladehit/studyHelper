'use strict';

const { BASE_URL, EMAIL } = require('../config/config');

module.exports = (email, token) => {
  return {
    to: email,
    from: EMAIL,
    subject: 'Reset account',
    html: `
      <h1>You forgot the password</h1>  
      <p>If not, ignore it</p>
      <p>Else click on link:</p>
      <p><a href="${BASE_URL}/auth/password/${token}">Reset password</a></p>
      <hr/>
      <a href="${BASE_URL}">Our web-site</a>
    `
  };
}