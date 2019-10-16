require.config( {
    waitSeconds: 0,
    paths: {
        jquery: 'web/js/jquery',
        text: 'web/js/text',
        markdown: 'web/js/showdown.min',
        mousewheel: 'web/js/jquery.mousewheel-3.0.6.min',
        scrollbar: 'web/js/jquery.mCustomScrollbar.min'
    },
    shim: {
        mousewheel: {
            deps: [ 'jquery' ]
        },
        scrollbar: {
            deps: [ 'jquery', 'mousewheel' ]
        }
    }
} );

/**
 * Web page rendering
 *
 * @param {Object} $
 * @param {Object} markdown
 */
require( [ 'jquery', 'markdown', 'mousewheel', 'scrollbar' ], function( $, markdown ) {

} );