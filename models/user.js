'use strict';

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  id: String,
  name: String
});

module.exports = mongoose.model('user', userSchema, 'user');