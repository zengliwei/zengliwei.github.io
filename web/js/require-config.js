require.config({
    waitSeconds: 0,
    paths: {
        jquery: 'web/js/lib/jquery',
        text: 'web/js/lib/text',
        markdown: 'web/js/lib/showdown.min',
        mousewheel: 'web/js/lib/jquery.mousewheel-3.0.6.min',
        popup: 'web/js/lib/jquery.fancybox.min',
        scrollbar: 'web/js/lib/jquery.mCustomScrollbar.min'
    },
    shim: {
        mousewheel: {
            deps: ['jquery']
        },
        scrollbar: {
            deps: ['jquery', 'mousewheel']
        }
    }
});