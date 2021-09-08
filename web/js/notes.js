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
    const $header = $('<header/>').insertBefore($main);
    const $footer = $('<footer/>').appendTo($body);

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

    /**
     * @return {string} uuid
     * @see https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
     */
    const uuidv4 = function () {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ window.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    };

    const $index = $('<nav id="index"/>').appendTo($body);
    const $sections = $main.find('h2, h3');
    if ($sections.length > 0) {
        $('<h3>本章目录</h3>').appendTo($index);
        $sections.each(function () {
            const el = $(this);
            let id = el.attr('id');
            if (!id) {
                id = uuidv4();
                el.attr('id', id);
            }
            $('<a/>').attr('href', window.location.pathname + '#' + id)
                .html('<span>' + el.html() + '</span>')
                .addClass(this.tagName.toLowerCase())
                .appendTo($index);
        });
    }

    $footer.html('Copyright &copy; <a href="/"><strong>Zengliwei</strong></a>. All rights reserved.');

    const $sidebarSwitcher = $('<a id="switcher"></a>').appendTo($header);
    $sidebarSwitcher.on('click', function () {
        if ($sidebar.hasClass('expanded')) {
            $sidebar.removeClass('expanded');
            $sidebarSwitcher.removeClass('expanded');
        } else {
            $sidebar.addClass('expanded');
            $sidebarSwitcher.addClass('expanded');
        }
    });

});