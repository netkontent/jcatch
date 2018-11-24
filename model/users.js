module.exports = function(root) {

  const passportLocalMongoose = require('passport-local-mongoose');

  let jCatchUserSchema = root.db.engine().Schema({
    email: String,
    password: String,
    domain: { type: String, default: null}, // TODO allow multiple projects
    api_key: String,
    token: { type: String, default: null},
    created:  { type: Date, default: Date.now },
  });

  const jCatchUserModel = root.db.engine().model('users', jCatchUserSchema);

  jCatchUserSchema.plugin(passportLocalMongoose);


  async function saveUser( email, pass ) {

      let exists = await userExists( email );

      if( exists ) {
          return {status: 'invalid', invalid: [{field: null, message: 'User already exists.'}]};
      } else {
        let newUserID = await insertUser( email, pass ),
            script = getScriptSample( newUserID );

        return {status: 'success', user_id: newUserID, script: script};
      }
  }


  function getScriptSample(user_id) {

      const Entities = require('html-entities').AllHtmlEntities;
      const entities = new Entities();

      let script = `
        <script src="http://jcatch.io/client/log.js?u=${user_id}"></script>
      `;

    return entities.encode(script);
  }


  async function insertUser( email, pass ) {

    const crypto = require('crypto');

    let slug = new Date().getTime() + email,
        api_key =  crypto.createHash('sha256').update( slug ).digest('base64'),
        _password = crypto.createHash('sha256').update( pass ).digest('hex');

        let UserSchema = new jCatchUserModel({
                email: email,
                password: _password,
                api_key: api_key,
            });

           let saved = await UserSchema.save();

  return saved._id ? saved._id : null;
  }

  async function userExists( email ) {

    let UserHandler = jCatchUserModel.model('users');
    let exists = await UserHandler.findOne({email: email}).exec();

  return exists;
  }


  return {
    model: jCatchUserModel.model('users'),
    schema: jCatchUserModel,
    save: saveUser,
    exists: userExists,
  };

};
