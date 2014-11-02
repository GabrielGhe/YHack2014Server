'use strict';

var mongoose = require('mongoose');

var boardSchema = mongoose.Schema({
  names:[String]
});

module.exports = mongoose.model('board', boardSchema, 'board');