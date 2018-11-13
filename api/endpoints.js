module.exports = function(root) {

  const bodyParser = require('body-parser');
  const crypto = require('crypto');

  root.app.use(bodyParser.urlencoded({extended: false}));
  root.app.use(bodyParser.json());

  root.app.get('/api/log/add/', function(req, res) {

    res.send('Test API');
  });

  root.app.post('/api/auth/', function(req, res) {

      if( ! req.body ) {
        res.json({ status: 'error', msg: 'No data.' });
      }

      let posted = req.body,
          token = null,
          User = root.db.use('user');

      let jCatchUserHandler = User.model('user');

      let user = jCatchUserHandler.findOne({_id: posted.user}, function(err, user_data) {

          if( err ) {
              root.log( err, {save: true} );
              return false;
          }


          if( user_data && user_data.api_key ) {

              token = crypto.createHash('sha256').update( user_data.api_key ).digest('base64');

          } else if( posted.user == 'demo') {

              token = crypto.createHash('sha256').update( 'demo' ).digest('base64');
          }

          if( token ) {

            jCatchUserHandler.updateOne({_id: user_data._id}, {token: token}, {upsert: true}, function(err) {

              if(err) {
                root.log( err, {save: true} );
                return res.status(500).send('Error occurred: Token cannot be set.');
              }

              res.json({ status: 'success', token: token });

            });

          } else {
              res.json({ status: 'error', msg: 'Token is not set.' });
          }

      });

  });


  root.app.post('/api/log/add/', function(req, res) {

    if( ! req.body ) {
      res.json({ status: 'error', msg: 'No data.' });
    }

    let data = req.body,
        Log = root.db.use('logs'),
        User = root.db.use('users');

    let jCatchLogHandler = new Log({
      user_id: data.user,
      domain: data.domain,
      type: 'error', // data.error.type,
      url: data.error.url,
      file: data.error.file,
      message: data.error.message,
      line: data.error.line,
      column: data.error.column,
      client: {
          userAgent: data.error.client.userAgent,
          cookie: data.error.client.cookie,
      },
      time: data.error.time,
      added: new Date().getTime(),
    });


    User.findOne({token: data.token}, function(err, user) {

        if( err ) {
          root.log( err, {save: true} );
          return res.status(500).send('Error occurred: user token not found.');
        }

        //user token is valid, now we can save
        jCatchLogHandler.save(function(err, data) {
          if(err) {
            root.log( err, {save: true} );
            return res.status(500).send('Error occurred: database error.');
          }
          res.json({ status: 'success', id: data._id });
        });

    });

  });


  root.app.use( (req, res) => {
    res.status('404').send('404');
  } );

  return root;
}
