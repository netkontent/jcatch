module.exports = function(root) {

    let cors = {};

    function setMethods( methods = [] ) {

      const defaultMethods = ['GET', 'PUT', 'POST', 'DELETE'];
      let _methods = [];

      if( Array.isArray(methods) ) {
          methods.forEach( function(method) {
              if( defaultMethods.includes(method) ) {
                _methods.push( method );
              }
          } );
      }

      if( _methods.length ) {

        cors.methods = _methods;
      }
    }


    function setOrigin( origin = '' ) {

      cors.origin = origin;
    }


    function getCors() {

      return cors;
    }


  return {
    setMethods: setMethods,
    setOrigin:  setOrigin,
    getCors:    getCors,
  }

}
