const root = { _dirname: __dirname };

    const nodemailer = require('nodemailer');




    // include custom logger
    root.log = require('./module/log.js');

    // init express
    const express = require('express');
    root.app = express();


    // set public folder
    root.app.use(express.static('public'));


    //VIEWS
    const viewConfig = require('./config/view.cfg.js')(root);


    //DB
    const db = require('./module/mongoose.js')(root);
    root.db = db;
    //init now
    root.db.connect('jcatch');


    //SESSIONS
    const auth = require('./module/auth.js')(root);
    root.passport = auth.passport();


    // ROUTES
    const routes = require('./module/routes.js')(root);
    routes.init();


    //ajax
    const ajax = require('./module/ajax.js')(root);
    ajax.init();


    //API
    let apiConfig = require('./config/api.cfg.js')(root);

        apiConfig.setMethods(['GET', 'POST']);
        apiCors = require('cors')( apiConfig.getCors() );

    root.app.use('/api', apiCors);

    const api = require('./api/endpoints.js')(root);


    /*
    let mailTransport = nodemailer.createTransport('SMTP',{
      service: 'Gmail',
      auth: {
        user: 'jcatch.smpt@gmail.com',
        pass: 'jcatch1@#',
      },
      tls: {
        rejectUnauthorized: false
      }
    });



    mailTransport.sendMail({
      from: 'jCatch.io Team <jcatch.smpt@gmail.com>',
      to: 'daniel@netkontent.pl',
      subject: 'Hi',
      text: 'Thank you.'
    }, function(err){
      if(err) console.error( 'Unable to send email: ' + error );
    });
    */


// run app
root.app.listen('3000');
