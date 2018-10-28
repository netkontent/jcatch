module.exports = function(root) {

  const bodyParser = require('body-parser');
  const ErrorModel = require('./model.js');

  root.app.use(bodyParser.urlencoded({extended: false}));
  root.app.use(bodyParser.json());

  root.app.get('/api/log/add/', function(req, res) {

    res.send('Test');
  });

  root.app.post('/api/log/add/', function(req, res) {

    if( ! req.body ) {
      res.send('Error: no data.');
    }


    let data = req.body;

    let a = new ErrorModel({
      user_id: data.user,
      type: 'error', // data.error.type,
      url: data.error.url,
      file: data.error.file,
      message: data.error.message,
      line: data.error.line,
      column: data.error.column,
      client: {
          userAgent: data.error.client.userAgent,
          cookie: true,// data.error.cookie,
      },
      time: data.error.time,
      added: new Date().getTime(),
    });

    a.save(function(err, a) {
      if(err) {
        console.log( err );
        return res.status(500).send('Error occurred: database error.');
      }
      res.json({ id: a._id });
    });

  });


  root.app.use( (req, res) => {
    res.status('404').send('404');
  } );

  return root;
}
