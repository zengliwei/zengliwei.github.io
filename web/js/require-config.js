require.config({
    waitSeconds: 0,
    baseUrl: '/web',
    paths: {
        jquery: 'lib/jquery',
        highlight: 'lib/highlight/highlight.min',
        mousewheel: 'lib/jquery.mCustomScrollbar/jquery.mousewheel-3.0.6.min',
        scrollbar: 'lib/jquery.mCustomScrollbar/jquery.mCustomScrollbar.min',
        vue: 'lib/vue.global.prod'
    },
    shim: {
        highlight: {
            exports: 'hljs'
        },
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