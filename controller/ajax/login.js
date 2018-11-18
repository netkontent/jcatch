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
      }
      if(!user) {
          res.json({status: 'error', message: info.message});
      }

      req.logIn(user, function(err) {

        if (err) {
          console.log(err);
          res.json({status: 'error', message: err.message});
        }

        res.json({status: 'success', user_id: user._id});

      });

  })(req, res, next);
}
