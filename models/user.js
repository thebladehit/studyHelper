'use strict';

const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExp: Date,
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

userSchema.methods.addToList = function(subject) {
  for (const item of this.list.items) {
    if (item.subjectId.toString() === subject._id.toString()) return;
  }
  this.list.items.push({ subjectId: subject._id });
  return this.save();
};

userSchema.methods.removeFromList = function(id) {
  this.list.items = this.list.items.filter(item => item.subjectId.toString() !== id.toString());
  return this.save();
};

module.exports = model('User', userSchema);