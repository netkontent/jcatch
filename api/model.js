const mongoose = require('mongoose');

mongoose
  .connect('mongodb://mongo:27017/jcatch', { useNewUrlParser: true })
  .then(() => { console.log('MongoDB connected.'); })
  .catch(err => console.log('err'));

let jcatchSchema = mongoose.Schema({
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

const jcatchModel = mongoose.model('jcatch', jcatchSchema);

module.exports = jcatchModel;
