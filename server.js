const root = { _dir: __dirname };
      root.log = require('./module/log.js');
      root.app = require('express')();

const routes = require('./module/routes.js')(root);
      routes.init();


root.app.listen('3000');
