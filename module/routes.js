module.exports = function(root) {

  const fs = require('fs');

  function init() {

    /* ##### START: ROUTES ##### */
    root.app.get('/', _controller('home') );
    root.app.get('/test', _controller('test') );

    // ignore /api/* 404 - as last
    root.app.use(/^\/(?!api|ajax).*/, (req, res) => {
      res.status('404').send('api - 404');
    } );

    /* ##### END: ROUTES ##### */

  }

  // controller autoloader
  function _controller( ctrl_name ) {

    let ctrl_path = root._dirname + '/controller/';

    if( fs.existsSync( ctrl_path + ctrl_name + '.js' ) ) {

      return require( ctrl_path + ctrl_name + '.js' );

    } else {

      root.log('Controller [' + ctrl_name + '] is defined, but is not found.', 'warning');

      return next();
    }

  }


  return {
    init: init
  };

};
