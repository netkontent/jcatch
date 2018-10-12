module.exports = function( obj, flag, opts ) {

  const path = require("path");

  let defaults = {
        as: 'plain',
        save: false,
        print: true,
        saveTo: path.join(__dirname, '../', 'logs/' + _getDate('Y-m-d') + '-node_log' ),
      };

  opts = {...defaults, ...opts};

  let _result = obj,
      _flag = '';

  switch( flag ) {
      case 'error': _flag = '[ERROR]: '; break;
      case 'warning': _flag = '[WARNING]: '; break;
      default: _flag = '';
  }

  switch( opts.as ) {
    case 'json':

        _result = JSON.stringify(obj);

        break;

    case 'plain':

        _result = obj;

        break;

    default:

      _result = obj;
  }

  // add date to log row
  _result =  _getDate() + ' | ' + _flag + _result;

  if( opts.save ) {

    const fs = require('fs');

    fs.appendFile(opts.saveTo, _result  + "\n", function (err) {
      if (err) throw err;
    });

  }

  if( opts.print ) {
    console.log( _result );
  }

  function _getDate(format = 'Y-m-d H:i:s') {

      let date = new Date(),

          Y = date.getFullYear(),
          m = date.getMonth().toString().length === 1 ? '0' + date.getMonth() : date.getMonth(),
          d = date.getDate().toString().length === 1 ? '0' + date.getDate() : date.getDate(),
          H = date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours(),
          i = date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes(),
          s = date.getSeconds().toString().length === 1 ? '0' + date.getSeconds() : date.getSeconds();


          // format date
          format = format.replace('Y', Y);
          format = format.replace('m', m);
          format = format.replace('d', d);
          format = format.replace('H', H);
          format = format.replace('i', i);
          format = format.replace('s', s);

          console.log( format );

      return format;

  }

}
