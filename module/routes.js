module.exports = function(root) {

  function init() {

    /* ##### START: ROUTES ##### */
    root.app.get('/', _controller('home.js') );
    root.app.get('/test', _controller('test.js') );

    // 404 - as last
    root.app.use(/^\/(?!api).*/, (req, res) => {
      res.status('404').send('api - 404');
    } );


    return root;
    /* ##### END: ROUTES ##### */

  }

  // private method
  function _controller( ctrl_name ) {

    const fs = require('fs');
    let ctrl_path = root._dir + '/controller/';

    if( fs.existsSync( ctrl_path + ctrl_name ) ) {

      return require( ctrl_path + ctrl_name );

    } else {

      root.log('Controller [' + ctrl_name + '] is defined, but is not found.', 'warning');

      return _missing_controller;
    }


    function _missing_controller( req, res, next ) {
      root.log('Client tried access to not existing, but defined route: ' + req.url, 'error', {save: true});
      return next(); // skip to 404
    }

  }


  return {
    init: init
  };

};
