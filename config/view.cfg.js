module.exports = function( root ) {

  const handlebars = require('express-handlebars').create({
              defaultLayout: 'main',
              helpers: {
                static: function(name) {
                  return require( root._dirname + '/lib/static.js').map(name);
                }
              }
        });

        root.app.engine('handlebars', handlebars.engine);
        root.app.set('view engine', 'handlebars');

}
