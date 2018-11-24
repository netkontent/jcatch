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


  root.passport.authenticate('login', function(error, user, info) {

      if(error) {
          res.json({status: 'error', message: error.message});
          return false;
      }
      if( ! user ) {
          res.json({status: 'error', message: info.message});
          return false;
      }

      req.logIn(user, function(err) {

        if (err) {
          next(err);
        }

        res.status(200).json({
              status: 'success',
              data: {user: user._id}
          });

      });


  })(req, res, next);


}
