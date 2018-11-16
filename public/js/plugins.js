;(function($) {

  $.fn.popik = function() {

      return this.each( function() {

          var popik = {},
              width = 300,
              trigger = $(this),
              content = getContent();

          trigger.on('click', function(c) {

            c.preventDefault();

            var hook = $(this),
                ix = getIndex(),
                group = hook.closest('*[data-group]'),
                wrap = group.length ? group : 'body';

            if(
                typeof hook.attr('data-popik_id') !== 'undefined' // clicked
                && $('#popik-'+hook.attr('data-popik_id')).length // opened
              ) {
                destroy( hook.attr('data-popik_id') );
                return false;
            } else {
                group.find('*[data-popik_id]').each( function() {
                    destroy( $(this).attr('data-popik_id') );
                });
            }

            var pos = getPosition(),
                _width = $(window).width() < 480 ? 'calc(100% - 30px)' : width + 'px';
                popik = $('<div>', {
                  id: 'popik-' + ix,
                  class: 'popik',
                  style: 'z-index:99;position:absolute;top:'+pos.y+'px;left:'+pos.x+'px;width:'+_width+';background:white;padding:10px 20px;border:solid 1 px;box-shadow: 0px 0 5px 3px rgba(0,0,0,0.45);',
                  html: getContent(),
                  click: function(c) {
                    c.preventDefault();
                    $(this).css('z-index', top+1);
                  }
                });

                var close_btn = $('<a>', {
                      href: 'close-'+ix,
                      html: 'x',
                      style: 'padding:2px;text-decoration:none;position:relative;top:-10px;right:-15px;float:right;font-weight:bold;color:red;',
                      click: function(c) {
                          c.preventDefault();
                          var id = $(this).attr('href').split('-')[1];
                          destroy( id );
                      }
                    });

                popik.prepend(close_btn).appendTo( wrap );
                hook.attr('data-popik_id', ix);
          });


          function destroy(x) {
            $('#popik-' + x).remove();
            $('*[data-popik_id="'+x+'"]').attr('data-popik_id', null);
          }


          function getPosition() {

              var _x = trigger.offset().left,
                  _y = trigger.offset().top;

                  var x = _x + parseInt( trigger.width() / 2 )  - width / 2;
                  var y = _y + parseInt( trigger.height() / 2 ) + 30;

                  if( $(window).width() >= 480 ) {

                    if( x < 0 ) {
                      x=10;
                    }else if( x + width > $(window).width() ) {
                      x = $(window).width() - width - 10;
                    }

                  } else {
                    x=15;
                  }



          return {x: x, y: y};
          }


          function getContent() {

              var _action = trigger.data('popik'),
                  parts = _action.split(':');

                  if( typeof parts[1] !== 'undefined' ) {
                      var type = parts[0];
                  } else {

                      if( $( _action ).length ) {
                        return $( _action ).html();
                      }
                  }

            return 'Content not found';

          }


          function getIndex() {
              return $('body').find('.popik').length;
          }

      } );

  }

  $.fn.unblock = function() {

      var el = this;

      el.find('.form-row').not('.last').css({opacity: 1});
      el.find('.submit.wrap .submit').css({opacity: 1});
      el.find('.submit.wrap .wrapik').remove();
      el.find('.block').remove();
  }

  $.fn.block = function(opt) {

      var defaults = {
            background: 'black',
          },
          o = $.extend({}, defaults, opt),
          el = this,
          int = 0;

          var wrap = $('<div/>', {class: 'block', style: 'position:absolute;width:100%;height:100%;z-index:9;top:0;left:0;background:transpatent;'}),
              wrapik = $('<div/>', {class: 'wrapik', style: 'position:absolute;width:100%;height:100%;z-index:9;top:0;left:0;background:transpatent;text-align:center;line-height:20px;font-size: 30px;'});

              wrap.appendTo( el );
              wrapik.appendTo( el.find('.submit.wrap') );

              loadingText();
              el.find('.form-row').not('.last').css({opacity: .35});
              el.find('.submit.wrap .submit').css({opacity: .35});

              function loadingText() {

                  var msg = '';

                  setTimeout(function() {

                    if(int===0) { msg = '.' }
                    if(int===1) { msg = '..'; }
                    if(int===2) { msg = '...'; }
                    if(int===3) { msg = ''; }

                    wrapik.text( msg );

                    int++;

                    if( int > 3 ) {
                      int=0;
                    }

                    loadingText();

                  }, 200);

              };

  }

  $.fn.inViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

})(jQuery);
