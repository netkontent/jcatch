function ErrorLess() {

    var user_id = getUserID(),
        _errors = [],
        _mode = null,
        _api = null;

    ;(function init() {

        if( ! user_id ) {
          console.log('user id not found');
          return false;
        }

        window.onerror = trackError;

        window.addEventListener('error', function(error) {
            trackErrorEvent(error);
        });

        console.log('Logger is running...');

    })();

    function trackErrorEvent(event) {

      var _err = {
            eid: getErrorID(),
            client: getClient(),
            error: {
              //clientError: event.error, //obj
              url: event.filepath,
              line: event.lineno,
              column: event.colno,
              message: event.message,
              file: event.filename,
              time: new Date().getTime(),
            },
          };

        track( _err );
    }


    function track( _err ) {

      stockError( _err );

      if( ! _api ) {
        _api = new ErorrLessAPI(user_id, _err);
      } else {
        _api.log( _err );
      }

    }

    function trackError( msg, url, line, column, error ) {

        var _err = {
              eid: getErrorID(),
              client: getClient(),
              error: {
                clientError: error,
                clientUrl: url,
                clientLine: line,
                clientColumn: column,
                clientMsg: msg,
              },
            };

        track( _err );
    }


    function stockError( error ) {
        _errors.push( error );
    }


    function getErrorID() {
        return _errors.length;
    }


    function getUserID() {

      var script_src = document.getElementById('errorless').src,
          user_id = decodeURIComponent(script_src.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent('u').replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));

    return user_id;
    }

    function getClient(mode, keys) {

        mode = mode || '';
        keys = keys || {};

        var defaults = ['userAgent'];

        var nav = window.navigator,
            client = {};

        switch( mode ) {
            case 'all':

                for (var key in nav) {
                  client[ key ] = nav[ key ];
                }
                break;

            default:

                for(var i=0,size=defaults.length;i<size;i++ ) {

                    if( defaults[i] in nav ) {
                        client[ defaults[i] ] = nav[ defaults[i] ];
                    }
                }
        }

    return client;
    }

}


var ErorrLessAPI = function( user_id, error ) {

      var _user_id = user_id;

      if( error ) {

        log( error );
      }


      function log( _err ) {

          ajax( function(res, rest) {

              if( res && rest ) {
                console.log( rest );
              }
          }, _err);
      }


      function ajax(callback, data, url, method) {

          url = url || 'http://jcatch.io/api/log/add/';
          method = method || 'POST';
          data = data || null;
          var cors = null;

          var xhr = new XMLHttpRequest();

          if ("withCredentials" in xhr) {

            // Check if the XMLHttpRequest object has a "withCredentials" property.
            // "withCredentials" only exists on XMLHTTPRequest2 objects.
            //xhr.open(method, url, true);
            cors = true;

          } else if (typeof XDomainRequest != "undefined") {

            // Otherwise, check if XDomainRequest.
            // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
            xhr = new XDomainRequest();
            //xhr.open(method, url);

          } else {

            // Otherwise, CORS is not supported by the browser.
            xhr = null;

          }

          xhr.onreadystatechange = function() {

            if ( this.readyState === 4 && this.status == 200 ) {

              if( typeof callback === 'function' ) {

                  return callback(this, data); // data is loop - fix that

              } else {
                  console.log( callback );
              }

            }
          };

          xhr.open(method, url, true);
          xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

          if( method === 'POST' ) {
              if( typeof data !== 'string' ) {
                data = JSON.stringify( {'user': _user_id, 'error': data} );
              }
          }
          xhr.send( data );
      }

  return {
    log: log,
  };

};

ErrorLess();
