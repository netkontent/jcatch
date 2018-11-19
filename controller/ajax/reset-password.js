module.exports = function(root, posted, req, res, next) {

  let validate = validateForm( posted.body );

  if( ! validate.status || validate.status === 'invalid' ) {
      return validate;
  }

  function validateForm( fields ) {

      let validation = {status: 'valid', invalid: []};

          for(input in fields) {

              // all required
              if( fields[input] === '' ) {
                validation.status = 'invalid';
                validation.invalid.push( {field: input, message: '$$label is required.'} )
              }
          }

      return validation;
  }

  res.json({status: 'error', message: 'TODO'});

}
