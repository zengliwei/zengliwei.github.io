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

    let footerHtml = '<div>Copyright &copy; ' + ( new Date ).getFullYear() + ' <a href="/">Zengliwei</a></div>' +
        '<div>ICP备案编号： 粤ICP备18048031号</div>';

    $footer.html( footerHtml );

} );