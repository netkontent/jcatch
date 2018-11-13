const root = { _dirname: __dirname };

      // include logger
      root.log = require('./module/log.js');

      // init express
      const express = require('express');
      root.app = express();

      // set public folder
      root.app.use(express.static('public'));

//VIEWS
      const viewConfig = require('./config/view.cfg.js')(root);


      //ajax
      const ajax = require('./module/ajax.js')(root);
      ajax.init();
// ROUTES
      const routes = require('./module/routes.js')(root);
      routes.init();



//DB
      const db = require('./module/mongoose.js')(root);
      root.db = db;

      //init now
      //root.db.connect('jcatch');



//API
      let apiConfig = require('./config/api.cfg.js')(root);

          apiConfig.setMethods(['GET', 'POST']);
          apiCors = require('cors')( apiConfig.getCors() );

      root.app.use('/api', apiCors);

      const api = require('./api/endpoints.js')(root);


// run app
root.app.listen('3000');
