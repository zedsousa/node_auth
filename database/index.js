const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodecrud');
mongoose.Promise = global.Promise;

module.exports = mongoose;