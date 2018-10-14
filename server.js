const express = require('express');
const root = { _dir: __dirname };

      root.log = require('./module/log.js');
      root.app = express();

      root.app.use(express.static('public')); // make /public -> public root

const handlebars = require('express3-handlebars').create({
            defaultLayout: 'main',
            helpers: {
              static: function(name) {
                return require('./lib/static.js').map(name);
              }
            }
      });
      root.app.engine('handlebars', handlebars.engine);
      root.app.set('view engine', 'handlebars');

const routes = require('./module/routes.js')(root);
      routes.init();

const api = require('./api/endpoints.js')(root);


root.app.listen('3000');
