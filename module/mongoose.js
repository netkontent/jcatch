module.exports = function(root) {

  const mongoose = require('mongoose');
  let models = {};

  function connect(db_name, port = '27017') {

      let reconnects = 5,
          reconnect_delay = 1000;

      mongoose
        .connect(`mongodb://mongo:${port}/${db_name}`, { useNewUrlParser: true })
        .then(() => {
            root.log(`DB ${db_name} connected.`);
        })
        .catch(err => {
            root.log(`DB ${db_name} connection error: ${err}`);
        });

      mongoose.connection.on('error', err => {
        root.log(`DB ${db_name} reconnect: #${reconnects} connection error: ${err}`);
        if( reconnects ) {
          setTimeout(retryConnection, reconnect_delay);
        }else {
          root.log(`Connection to DB ${db_name} failed. Stoped permanetly.`);
        }
      });

      let retryConnection = function() {
        reconnects--;
        return mongoose.connect(`mongodb://mongo:${port}/${db_name}`, { useNewUrlParser: true });
      };

  return mongoose;
  }

  function getEngine() {

    return mongoose;
  }

  function use(hook) {

      if( ! (hook in models) ) {
        models[hook] = _model(hook);
      }

      return models[hook];
  }

  // model autoloader
  function _model( model_name ) {

    const fs = require('fs');
    let model_path = root._dirname + '/model/';

    if( fs.existsSync( model_path + model_name + '.js' ) ) {

      return require( model_path + model_name + '.js' )(root);

    } else {

      root.log('Model [' + model_name + '] is defined, but is not found.', 'warning');
    }

  return false;
  }

  return {
    connect: connect,
    use: use,
    engine: getEngine,
  };
};
