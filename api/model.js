const mongoose = require('mongoose');
let reconnects = 0;

mongoose
  .connect('mongodb://mongo:27017/jcatch', { useNewUrlParser: true })
  .then(() => { console.log('MongoDB connected.'); })
  .catch(err => {
      console.log(`MongoDB initial connection error: ${err}`);
  });

mongoose.connection.on('error', err => {
  console.log(`MongoDB reconnect: #${reconnects} connection error: ${err}`)
  if( reconnects < 5 ) {
    setTimeout(retryConnection, reconnects*1000);
  }else {
    console.log('Connection do mongodb failed. Stoped permanetly.');
  }
})

let retryConnection = function() {
  reconnects++;
  return mongoose.connect('mongodb://mongo:27017/jcatch', { useNewUrlParser: true });
}


let jCatchLogSchema = mongoose.Schema({
  user_id: String,
  domain: String,
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


let jCatchUserSchema = mongoose.Schema({
  email: String,
  domain: String, // TODO allow multiple projects
  api_key: String,
  created:  { type: Date, default: Date.now },
});

const jCatchLog = mongoose.model('jCatchLog', jCatchLogSchema);
const jCatchUser = mongoose.model('jCatchUser', jCatchUserSchema);

module.exports = {
  user: jCatchUser,
  log: jCatchLog,
};
