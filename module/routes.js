module.exports = function(root) {

  const fs = require('fs');
  const url = require('url');

  function init() {

    //asign loged user to view
    root.app.use(function(req, res, next) {

        if( req.isAuthenticated() ) {
          res.locals.user = req.user;
        }

        next();
    });


    root.app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });


    // ignore /api/* 404 - as last
    root.app.use(/^\/(?!api|ajax).*/, (req, res) => {

      let ctrl_path_file = resolveParams( req );

      if( ctrl_path_file ) {

        return require( ctrl_path_file  )(req, res);

      } else {

        res.status('404').send('404');
      }

    } );

  }


  function resolveParams( req ) {

      let full_url = req.protocol + '://' + req.get('host') + req.originalUrl;
      let _url = url.parse(full_url, true);

      // resolve home page
      let pathname = _url.pathname == '/' ? '/home' : _url.pathname;

      // build absth path to file
      let path = root._dirname + '/controller' + pathname + '.js';

  return fs.existsSync( path  ) ? path : false;
  }


  return {
    init: init
  };

};
