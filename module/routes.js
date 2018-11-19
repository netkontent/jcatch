module.exports = function(root) {

  const fs = require('fs');

  function init() {

    //asign loged user to view
    root.app.use(function(req, res, next) {

        if( req.isAuthenticated() ) {
          res.locals.user = req.user;
        }

        next();
    });

    /* ###  ## START: ROUTES ##### */

    root.app.get('/logout', (req, res) => { req.logout(); res.redirect('/') } );


    // ignore /api/* 404 - as last
    root.app.use(/^\/(?!api|ajax).*/, (req, res) => {

      let ctrl_path = root._dirname + '/controller' + req.originalUrl;

      if( fs.existsSync( ctrl_path + '.js' ) ) {

        return require( ctrl_path + '.js' )(req, res);

      } else {

        res.status('404').send('api - 404');
      }

    } );

    /* ##### END: ROUTES ##### */

  }

  // controller autoloader
  function _controller( ctrl_name ) {



  }


  return {
    init: init
  };

};
