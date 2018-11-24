module.exports = function(root) {
/* jshint ignore:start */
  const bodyParser = require('body-parser');
  const fs = require('fs');
  let jsonParser = bodyParser.json();

  function init() {

    /* ##### START: AJAX ##### */
    //root.app.post('/ajax/login/', jsonParser, actionLoader );

    root.app.post('/ajax/:action/', jsonParser, actionLoader);
    root.app.get('/ajax/:action/', actionLoader);

    return root;
    /* ##### END: AJAX ##### */

  }

  // ajax controller autoloaderSW
  function actionLoader(req, res, next) {

      let action = req.params.action || null,
          req_data = getRequestData( req ),
          ajax_path = root._dirname + '/controller/ajax/';

      if( ! req_data ) {
        res.json({ status: 'error', msg: 'No posted data set.' });
        return false;
      }

      if( ! action ) {
        res.json({ status: 'error', msg: 'No action set.' });
        return false;
      }

      let ctrl_ajax_path_file = resolveParams( action );

      if( ctrl_ajax_path_file ) {

        let prom = require( ctrl_ajax_path_file )(root, req_data, req, res, next);

        if( prom ) {
          prom.then(  _res =>  {
            res.json( _res );
          } ).catch(err => {
            console.error(err)
          });
        } 

      } else {

        res.status('404').send('ajax - 404');

        return false;
      }
  };


  function getRequestData( req ) {

      let data = null;

      switch( req.method ) {
          case 'POST':

              data = req || null;

              break;

          case 'GET':

              data = req.params || null;

              break;
      }

  return data;
  }

  function resolveParams( action ) {

      // build absth path to file
      let path = root._dirname + '/controller/ajax/' + action + '.js';

  return fs.existsSync( path ) ? path : false;
  }


  return {
    init: init
  };
/* jshint ignore:end */
};
