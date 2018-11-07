module.exports = function(root) {

  let jCatchUserSchema = root.db.engine.Schema({
    email: String,
    domain: String, // TODO allow multiple projects
    api_key: String,
    created:  { type: Date, default: Date.now },
  });

  const jCatchLogModel = root.db.engine.model('jCatchUser', jCatchUserSchema);

  return jCatchLogModel;

};
