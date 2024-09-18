require([
    'jquery'
], function ($) {
    'use strict';

    const $body = $('body');
    const $footer = $('<footer/>').appendTo($body);

    const initFooter = function () {
        $footer.html('Copyright &copy; <a href="/"><strong>Zengliwei</strong></a>. All rights reserved.');
    };

    initFooter();

});