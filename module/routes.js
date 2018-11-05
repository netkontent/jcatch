module.exports = function(root) {

  function init() {

    /* ##### START: ROUTES ##### */
    root.app.get('/', _controller('home') );
    root.app.get('/test', _controller('test') );

    // ignore /api/* 404 - as last
    root.app.use(/^\/(?!api).*/, (req, res) => {
      res.status('404').send('api - 404');
    } );


    return root;
    /* ##### END: ROUTES ##### */

  }

  // controller autoloader
  function _controller( ctrl_name ) {

    const fs = require('fs');
    let ctrl_path = root._dir + '/controller/';

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
