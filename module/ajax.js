module.exports = function(root) {
/* jshint ignore:start */
  const bodyParser = require('body-parser');
  const fs = require('fs');
  let jsonParser = bodyParser.json();

  function init() {

    /* ##### START: AJAX ##### */
    root.app.post('/ajax/:action/', jsonParser, actionLoader);

    return root;
    /* ##### END: AJAX ##### */

  }

  // ajax controller autoloader

  async function actionLoader(req, res) {


      let posted = req.body,
          action = req.params.action,
          ajax_path = root._dirname + '/controller/ajax/';

      if( ! posted ) {
        res.json({ status: 'error', msg: 'No posted data.' });
        return false;
      }

      if( ! action ) {
        res.json({ status: 'error', msg: 'No action.' });
        return false;
      }


      if( fs.existsSync( ajax_path + action + '.js' ) ) {

        $res = await require( ajax_path + action + '.js' )(root, posted);
        
        res.json( $res );

      } else {

        root.log('Controller [' + action + '] is defined, but is not found.', 'warning');

        return false;
      }
  };


  return {
    init: init
  };
/* jshint ignore:end */
};
