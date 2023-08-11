'use strict';

const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  list: {
    items: [
      {
        subjectId: {
          type: Schema.Types.ObjectId,
          ref: 'Subject',
          required: true
        }
      }
    ]
  }
});

module.exports = model('User', userSchema);