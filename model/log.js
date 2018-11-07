module.exports = function(root) {

  let jCatchLogSchema = root.db.engine.Schema({
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

  const jCatchLogModel = root.db.engine.model('jCatchLog', jCatchLogSchema);

  return jCatchLogModel;

};
