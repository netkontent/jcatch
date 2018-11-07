module.exports = function(root) {

  const bodyParser = require('body-parser');

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
          User = root.db.model('user');

      let jCatchUserHandler = User.model('jCatchUser');

      let user = jCatchUserHandler.findOne({domain: posted.domain}, function(err, data) {

          const crypto = require('crypto');

          if( err ) {
              root.log( err );
              return false;

          } else if( data && data.api_key ) {

              let token = crypto.createHash('sha256').update( data.api_key ).digest('base64');
        }

        if( posted.user == 'demo') {

            token = crypto.createHash('sha256').update( 'demo' ).digest('base64');

        }

        res.json({ status: 'success', token: token });
      });

  });


  root.app.post('/api/log/add/', function(req, res) {

    if( ! req.body ) {
      res.json({ status: 'error', msg: 'No data.' });
    }

    let data = req.body,
        Log = root.db.model('log');

    let jCatchModelHandler = new Log({
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


    jCatchModelHandler.save(function(err, data) {
      if(err) {
        root.log( err, {save: true} );
        return res.status(500).send('Error occurred: database error.');
      }
      res.json({ status: 'success', id: data._id });
    });

  });


  root.app.use( (req, res) => {
    res.status('404').send('404');
  } );

  return root;
}
