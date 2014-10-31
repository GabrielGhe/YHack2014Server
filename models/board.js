'use strict';

var mongoose = require('mongoose');

var boardSchema = mongoose.Schema({

});

module.exports = mongoose.model('board', boardSchema, 'board');