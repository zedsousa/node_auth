const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/node_auth');
mongoose.Promise = global.Promise;

module.exports = mongoose;