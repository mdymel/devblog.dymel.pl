/**
 * Main JS file for BlogInn behaviours
 */

/*globals jQuery, document */
(function ($) {
    "use strict";

    $(document).ready(function(){
        // Responsive video embeds
        $('.entry-content').fitVids();

        // Navigation
        $('#menu-toggle').click(function(){
            var _this = $(this);
            _this.toggleClass( 'toggled-on' ).attr('aria-expanded', _this.attr('aria-expanded') === 'false' ? 'true' : 'false');
            $('.nav-menu').slideToggle();
        });
        $(window).bind('resize orientationchange', function() {
            if ( $('#menu-toggle').is(':hidden') ) {
                $('#menu-toggle').removeClass('toggled-on').attr('aria-expanded', 'false');
                $('.nav-menu').removeAttr('style');
            }
        });

        // Scroll to top
        $('#top-link').on('click', function(e) {
            $('html, body').animate({'scrollTop': 0});
            e.preventDefault();
        });

        // Mailchimp form 
        $('#mc-embedded-subscribe-form').on('submit', function(e){
            e.preventDefault();
            var form = $('#mc-embedded-subscribe-form');

            if ($('#mce-EMAIL').val() === "") {
                return;
            }

            $.ajax({
                type: form.attr('method'),
                url: form.attr('action'),
                data: form.serialize(),
                cache       : false,
                dataType    : 'jsonp',
                jsonp       : 'c',
                contentType: "application/json; charset=utf-8",
                error       : function(err) { 
                    toastr.error("Could not connect to the registration server. Please try again later.");
                },
                success     : function(data) {
                    toastr.success("Please click the link in the email we just sent you", "Confirm your email address");
                }
            });
        });
    });

}(jQuery));


