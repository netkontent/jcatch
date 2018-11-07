module.exports = function(root) {

  const mongoose = require('mongoose');
  let reconnects = 0;

  function connect() {

      mongoose
        .connect('mongodb://mongo:27017/jcatch', { useNewUrlParser: true })
        .then(() => {
            root.log('MongoDB connected.');
        })
        .catch(err => {
            root.log(`MongoDB initial connection error: ${err}`);
        });

      mongoose.connection.on('error', err => {
        root.log(`MongoDB reconnect: #${reconnects} connection error: ${err}`)
        if( reconnects < 5 ) {
          setTimeout(retryConnection, reconnects*1000);
        }else {
          root.log('Connection do mongodb failed. Stoped permanetly.');
        }
      })

      let retryConnection = function() {
        reconnects++;
        return mongoose.connect('mongodb://mongo:27017/jcatch', { useNewUrlParser: true });
      }

  return mongoose;
  }

  function getEngine() {

    return mongoose;

  }

  function getModel(hook) {

      return _model(hook);
  }

  // model autoloader
  function _model( model_name ) {

    const fs = require('fs');
    let model_path = root._dir + '/model/';

    if( fs.existsSync( model_path + model_name + '.js' ) ) {

      return require( model_path + model_name + '.js' )(root);

    } else {

      root.log('Model [' + model_name + '] is defined, but is not found.', 'warning');
    }

  return false;
  }

return {
  connect: connect,
  model: getModel,
  engine: getEngine,
}
}
