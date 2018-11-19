;(function($) {

    $('*[data-popik]').popik();

    $(document).on('dynamicElementCreated', function(e, el) {

        el.find('*[data-popik]').popik();
    });

    $(document).ready( function() {

        $(document).on('submit', 'form[data-form]', function(s) {

            s.preventDefault();

            var form = $(this),
                action = form.data('form'),
                data = getFormData(form),
                msg = form.find('.response-msg');

                msg.removeClass('set').empty();

                form.block();

                $.ajax({
                  method: "POST",
                  url: '/ajax/'+ action +'/',
                  contentType: 'application/json',
                  cache: false,
                  data: JSON.stringify(data),
                  form: form,
                }).done( function(res) {

                    var msg = form.find('.response-msg');
                        msg.attr({ class: 'response-msg set ' + res.status });

                    form.unblock();

                    if( res.status === 'success' ) {

                        form.resolve( res );

                    } else if( res.status === 'invalid' ){

                        msg.html( getErrorMsg( form, res.invalid ) );

                    } else if( res.status === 'error' ) {

                        msg.html( res.message );

                    } else {
                      console.log( res.message );
                    }
                });
        });

        function getFormData($form){
            var unindexed_array = $form.serializeArray();
            var indexed_array = {};

            $.map(unindexed_array, function(n, i){
                indexed_array[n['name']] = n['value'];
            });

            return indexed_array;
        }

        function getErrorMsg( form, errors ) {

            var display_html = [];

            errors.forEach( function(error) {
              var label = form.find('label[for='+error.field+'] span').text();
              var msg = error.message.replace('$$label', label);
              display_html.push( msg );
            } );

        return display_html.join('<br/>');
        }

    } );

})(jQuery);
