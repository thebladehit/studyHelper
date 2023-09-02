'use strict';

const multer = require('multer');

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'images');
  },
  filename(req, file, callback) {
    callback(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, callback) => allowedTypes.includes(file.mimetype) ? callback(null, true) : callback(null, false);

module.exports = multer({ storage, fileFilter });