/**
 * Web page rendering
 */
require( [
    'jquery',
    'mousewheel',
    'scrollbar'
], function ( $ ) {

    let $header = $( 'header' );
    let $footer = $( 'footer' );

    $footer.html( 'Copyright &copy; ' + ( new Date ).getFullYear() + ' <a href="/">Zengliwei</a>' );

} );