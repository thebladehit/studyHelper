'use strict';

const { Schema, model } = require('mongoose');

const subjectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  teacher: {
    type: String,
    required: true
  },
  shortName: {
    type: String,
    required: true
  }
});

module.exports = model('Subject', subjectSchema);