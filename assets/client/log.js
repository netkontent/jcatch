try { (function jCatchListener() {

        var _user_id = getUserID(),
            _domain = window.location.hostname,
            _token = null,
            _errors = [],
            _api = null,
            _endpoints = {
                uri: 'http://jcatch.io/api/',
                  log:  'log/add/',
                  auth: 'auth/',
                get: function(key) {
                  return this.uri + this[key];
                }
            },
            _queue = [];


        if( ! _user_id ) {
          console.warn('jCatch: user id is not set. Please read: http://jcatch.io/help#user-id-not-set');
          return false; // exit now
        }


        window.addEventListener('error', function(error) {
            logErrorEvent(error);
        } );

        function logErrorEvent(event) {

          var client = getClient();

          var error_data = {
                eid: _errors.length,
                error: {
                  url: event.filepath,
                  line: event.lineno,
                  column: event.colno,
                  message: event.message,
                  file: event.filename,
                  time: new Date().getTime(),
                  client: {
                    userAgent: client.userAgent,
                    cookie: true, // TODO real cookie
                  }
                },
              };

              _errors.push(error_data);

              if( ! _api ) {
                var credentials = {user: _user_id, domain: _domain};
                _api = new jCatchAPI(credentials);
              }

              _api.log( error_data );
        }


        function getUserID() {

          var scripts = document.querySelectorAll('script[src]'),
              user_id=null;

              for(var i=0;i<scripts.length;i++) {

                  if(
                      typeof scripts[0].src !== 'undefined'
                      && scripts[0].src.indexOf('jcatch.io') !== -1
                  ) {
                    var script_src = scripts[0].src;
                    user_id = decodeURIComponent(script_src.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent('u').replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
                    break;
                  }
              }

        return user_id;
        }


        function getClient(mode, keys) {

            mode = mode || '';
            keys = keys || {};

            var defaults = ['userAgent', 'cookie'],
                nav = window.navigator,
                client = {};

            switch( mode ) {
                case 'all':

                    for (var key in nav) {
                      client[ key ] = nav[ key ];
                    }
                    break;

                default:

                    for(var i=0,size=defaults.length;i<size;i++) {

                        if( defaults[i] in nav ) {
                            client[ defaults[i] ] = nav[ defaults[i] ];
                        }
                    }
            }

        return client;
        }

        function jCatchAPI( credentials ) {

              _ajax(
                function setAuth(res) {

                    var _res = JSON.parse(res);
                    _token = _res.token;

                    var date = new Date();
                    date.setTime(date.getTime() + (24*60*60*1000));
                    var expires = 'expires=' + date.toUTCString();
                    document.cookie = '_jcatch_' + '=' + _token + ';' + expires + ';path=/';

                    if( _queue.length ) {
                      _queue.forEach( function(_err) {
                          log( _err );
                          delete _queue[_err];
                      } );
                    }

                },
                credentials,
                _endpoints.get('auth')
              );


              function auth() {

                  var token = null;

                  var cookies = decodeURIComponent(document.cookie).split(';'),
                      key = '_jcatch_=';

                  for(var i=0;i<cookies.length;i++) {
                    var c = cookies[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(key) == 0) {
                        token = c.substring(key.length, c.length);
                    }
                  }

              return token;
              }


              function log( _err ) {

                if( auth() ) {

                  _ajax( function(res) {

                      //console.log( res ); //DEBUG

                  }, _err);

                } else {
                  _queue.push( _err );
                }
              }


              function _ajax(callback, data, url, method) {

                  url = url || _endpoints.get('log');
                  method = method || 'POST';
                  data = data || null;

                  var xhr = new XMLHttpRequest();

                  xhr.onreadystatechange = function() {

                    if ( this.readyState === 4 && this.status == 200 ) {

                      return callback(this.response);
                    }
                  };

                  xhr.open(method, url, true);
                  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

                  if( method === 'POST' ) {
                      if( typeof data !== 'string' ) {
                        data = JSON.stringify( {user: _user_id, domain: _domain, error: data.error} );
                      }
                  }
                  xhr.send( data );
              }

          return {
            log: log
          };
        }

  })();

}
catch {
  console.warn('jCatch is not running.');
  console.error(e);
}
