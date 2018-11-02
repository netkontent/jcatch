const express = require('express');
const root = { _dir: __dirname };

      root.log = require('./module/log.js');
      root.app = express();

      let allowCrossDomain = function(req, res, next) {
          res.header('Access-Control-Allow-Origin', "*");
          res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
          res.header('Access-Control-Allow-Headers', 'Content-Type');
          next();
      }

      root.app.use(allowCrossDomain);

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
      routes.init(); // as method, maybe we can add other method there

/*
 * TODO move API to separate node build
 */
root.app.use('/api', require('cors')());
const api = require('./api/endpoints.js')(root);


root.app.listen('3000');
