module.exports = async function(root, posted, req, res, next) {

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
                validation.invalid.push( {field: input, message: '$$label is required.'} );
              }
          }

          //pass match
          if( fields['pass'] !== fields['repass'] ) {
            validation.status = 'invalid';
            validation.invalid.push( {field: 'register-pass', message: '$$label not match.'} );
          }

      return validation;
  }


  const User = root.db.use('users');
  let result = await User.save( posted.body.email, posted.body.pass );


return result;
}
