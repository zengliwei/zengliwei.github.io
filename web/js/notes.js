require([
    'jquery',
    'highlight',
    'mousewheel',
    'scrollbar'
], function ($, highlight) {
    'use strict';

    const $win = $(window);
    const $doc = $(document);
    const $body = $('body');
    const $main = $body.find('> main');
    const $sidebar = $('<section class="sidebar"/>').insertBefore($main);
    const $search = $('<section id=search/>').appendTo($sidebar);
    const $searchForm = $('<form/>').appendTo($search);
    const $searchInput = $('<input type="text" placeholder="搜索标题"/>').appendTo($searchForm);
    const $nav = $('<nav/>').appendTo($sidebar);

    const renderTree = function (tree, $parentNode, level) {
        for (let c = 0; c < tree.length; c++) {
            const $link = $('<a/>')
                .attr('title', tree[c].title)
                .addClass('nav-item')
                .addClass('level-' + level)
                .html('<span>' + tree[c].title + '</span>')
                .appendTo($parentNode);

            if (tree[c]['children']) {
                renderTree(tree[c]['children'], $parentNode, level + 1);
            } else {
                $link.attr('href', tree[c]['path']);
            }
        }
    };

    let $navItems;

    $.ajax({
        url: '/notes/index.json',
        success: function ($source) {
            renderTree($source, $nav, 1);
            $navItems = $nav.find('a.nav-item');
        }
    });

    $searchInput.on('input', function (evt) {
        const q = $searchInput.val().replace(/^s/, '');
        if (q === '') {
            $navItems.show();
        } else {
            $navItems.each(function (i, el) {
                el.innerText.indexOf(q) > -1 ? $(el).show() : $(el).hide();
            });
        }
        $nav.mCustomScrollbar({
            axis: 'yx',
            theme: 'minimal-dark'
        });
    });

    window.hljs.highlightAll();
    $main.mCustomScrollbar({
        axis: 'yx',
        theme: 'minimal-dark'
    });
    const $index = $('<nav/>').appendTo($main);

});