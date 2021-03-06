;(function($) {

  $.fn.resolve = function(res) {

      var form = this,
          msg = form.find('.response-msg');;

      switch( form.data('form') ) {

          case 'try':
              msg.html( res.msg );
              form.find('.form-body').slideUp('fast');

              var code = $('<div>', {class: 'code', html: res.script});
              code.appendTo( form );
          break;

          case 'login':
              location.reload(); //TODO dynamic
          break;

          case 'register':
              msg.html( 'User has been registered. Plase <a href="#login" data-popik="#login">Login</a>' );
              form.find('.form-body').slideUp('fast');
              $(document).trigger('dynamicElementCreated', [form]);
          break;

      }

  }

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
                wrap = group.length ? group : 'body',
                pos = hook.closest('.popik').length ? hook.closest('.popik').offset() : getPosition();

            if(
                typeof hook.attr('data-popik_id') !== 'undefined' // clicked
                && $('#popik-'+hook.attr('data-popik_id')).length // opened
              ) {
                destroy( hook.attr('data-popik_id') );
                return false;
            } else {
                //find all triggers
                group.find('*[data-popik_id]').each( function() {
                    destroy( $(this).attr('data-popik_id') );
                });

                // find all virtuals
                group.find('.popik').each( function() {
                    destroy( $(this).attr('id').replace('popik-', '') );
                } );
            }

            var _width = $(window).width() < 480 ? 'calc(100% - 30px)' : width + 'px';
                popik = $('<div>', {
                  id: 'popik-' + ix,
                  class: 'popik',
                  style: 'z-index:99;position:absolute;top:'+pos.top+'px;left:'+pos.left+'px;width:'+_width+';background:white;padding:10px 20px;border:solid 1 px;box-shadow: 0px 0 5px 3px rgba(0,0,0,0.45);',
                  click: function(c) {
                    $(this).css('z-index', top+1);
                  },
                }).prepend( getContent() );

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

                //fire event
                $(document).trigger('dynamicElementCreated', [popik]);
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



          return {left: x, top: y};
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

      var el = this,
          submit = el.find('input[type=submit]');

      el.find('.form-body').css({opacity: 1});
      submit.val( submit.data('val') );
      el.find('.block').remove();
  }

  $.fn.block = function(opt) {

      var defaults = {
            background: 'black',
          },
          o = $.extend({}, defaults, opt),
          el = this,
          int = 0;

          var wrap = $('<div/>', {class: 'block', style: 'position:absolute;width:100%;height:100%;z-index:9;top:0;left:0;background:transpatent;cursor:wait'}),
              submit_button = el.find('input[type=submit]');

              el.css({position: 'relative'});
              wrap.appendTo( el );

              el.find('.form-body').css({opacity: .45});
              submit_button.attr('data-val', submit_button.val()).val('Please wait');
  }

  $.fn.inViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

})(jQuery);
