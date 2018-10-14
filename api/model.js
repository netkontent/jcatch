const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/errorlog');

var errorLogSchema = mongoose.Schema({
  user_id: String,
  type: String,
  url: String,
  file: String,
  message: String,
  line: Number,
  column: Number,
  client: {
      userAgent: String,
      cookie: Boolean,
  },
  time: Date,
  added:  { type: Date, default: Date.now },
});

const ErrorLog = mongoose.model('errorlog', errorLogSchema);

module.exports = ErrorLog;
