require.config({
    waitSeconds: 0,
    baseUrl: '/web/js',
    paths: {
        jquery: 'lib/jquery',
        highlight: 'lib/highlight.min',
        mousewheel: 'lib/jquery.mousewheel-3.0.6.min',
        scrollbar: 'lib/jquery.mCustomScrollbar.min',
        vue: 'lib/vue.global.prod'
    },
    shim: {
        mousewheel: {
            deps: ['jquery']
        },
        scrollbar: {
            deps: ['jquery', 'mousewheel']
        },
        vue: {
            exports: 'Vue'
        }
    }
});