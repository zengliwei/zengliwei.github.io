require([
    'jquery',
    'vue',
    'highlight',
    'mousewheel',
    'scrollbar'
], function ($, Vue) {
    'use strict';

    const html = $('body > main').html();

    const app = Vue.createApp({

        template: `<header><a class="btn-switcher"></a></header>`
            + `<aside class="sidebar">`
            + `<section id="search"><input type="text" placeholder="搜索标题" v-model="keyword"/></section>`
            + `<nav v-if="favours.length > 0" class="favours"><ul><li class="level-1 has-child activated">`
            + `<a href="javascript:"><span>我的收藏</span></a>`
            + `<ul><li v-for="item in favours"><a class="favoured" :href="item.url">`
            + `<span v-html="item.title"></span><span class="favour" @click.stop.prevent="(evt) => switchFavour(item)"></span>`
            + `</a></li></ul>`
            + `</li></ul></nav>`
            + `<nav class="links"><nav-menu :items="menuItems"></nav-menu></nav>`
            + `</aside>`
            + `<main><article v-html="content" ref="article"/></main>`
            + `<aside v-show="indexItems.length > 0" class="index"><h3>本文索引</h3><nav ref="index">`
            + `<a v-for="item in indexItems" :class="item.tag" :href="item.url" >{{ item.title }}</a>`
            + `</nav></aside>`
            + `<footer>Copyright &copy; <a target="_blank" href="https://zengliwei.github.io/"><strong>Zengliwei</strong></a>. All rights reserved.</footer>`,

        data: function () {
            return {
                content: html,
                keyword: '',
                favours: [],
                menuItems: [],
                indexItems: []
            };
        },

        provide: function () {
            return {
                keyword: Vue.computed(() => this.keyword),
                favours: Vue.computed(() => this.favours)
            }
        },

        watch: {
            favours: {
                deep: true,
                handler: function (favours) {
                    let favourUrls = {};
                    favours.forEach(item => {
                        favourUrls[item.url] = item.favoured;
                    });
                    this.favourUrls = favourUrls;
                    window.localStorage.setItem('note-favours', JSON.stringify(favourUrls));
                }
            }
        },

        methods: {
            processMenuItems: function (menuItems, level = 1, parent) {
                parent = parent || {};
                menuItems.forEach(item => {
                    item.level = level;
                    if (item.url === this.currentUrl) {
                        item.isCurrent = true;
                        parent.activated = true;
                    }
                    if (this.favourUrls[item.url]) {
                        item.favoured = true;
                        this.favours.push(item);
                    }
                    if (item.children) {
                        if (item.children.length > 0) {
                            this.processMenuItems(item.children, level + 1, item);
                            item.activated && (parent.activated = true);
                        } else {
                            delete item.children;
                        }
                    }
                });
            },

            generateId: function (prefix) {
                prefix = prefix || '';
                const timestamp = Date.now().toString();
                const randomNum = Math.floor(Math.random() * 10000).toString();
                return `${prefix}${timestamp}${randomNum}`;
            },

            switchFavour: function (item) {
                item.favoured = !item.favoured;
                item.favoured
                    ? this.favours.push(item)
                    : this.favours.splice(this.favours.indexOf(item), 1);
            }
        },

        created: function () {
            this.currentUrl = window.location.pathname.substr(1);
            this.favourUrls = JSON.parse(window.localStorage.getItem('note-favours')) || {};

            $.ajax('/notes/index.json').then((menuItems) => {
                this.processMenuItems(menuItems);
                this.menuItems = menuItems;
            });
        },

        mounted: function () {
            const $article = $(this.$refs.article), $index = $(this.$refs.index), $detail = $(this.$refs.detail);

            $article.find('h2, h3, h4').each((i, el) => {
                el.id = el.id || this.generateId('p-');
                this.indexItems.push({
                    title: el.innerText,
                    url: `${this.currentUrl}#${el.id}`,
                    tag: el.tagName.toLowerCase()
                });
            });

            $(document).on('scroll', () => {
                let scrollTop = Math.ceil($('html').scrollTop());
                $article.find('h2, h3, h4').each((i, el) => {
                    let start = Math.floor($(el).position().top);
                    if (scrollTop >= start) {
                        $index.find('a').eq(i).addClass('current').siblings().removeClass('current');
                    }
                });
            });

            /*$article.find('[data-ref]').each((i, el) => {
                let $translation = $(el),
                    $orgContent = $article.find('[data-id="' + $translation.data('ref') + '"]');
                if ($orgContent.length === 0) {
                    return;
                }
                $translation.find('> *').each((i, el) => {
                    let $content = $orgContent.find('> *').eq(i);
                    if ($content.length > 0) {
                        let $el = $(el);
                        $el.on('mouseenter', () => {
                            let pos = $el.position();
                            $detail.html(`${$content.html()}`).show()
                                .css({left: `${pos.left}px`, top: `${pos.top - $detail.outerHeight()}px`});
                        });
                    }
                });
            });*/

            $('.btn-switcher').on('click', () => {
                $('body').toggleClass('nav-expanded');
            });
        }
    });

    app.component('nav-menu', {

        template: `<ul><li v-for="item in items" :class="getItemClass(item)">`
            + `<a href="javascript:" :class="{favoured: item.favoured}" @click="clickItem(item)">`
            + `<span v-html="item.title"/>`
            + `<span v-if="item.level > 1 && item.url" class="favour" @click.stop="(evt) => switchFavour(item)"/>`
            + `</a>`
            + `<nav-menu v-if="item.children && item.children.length > 0" :items="item.children"/>`
            + `</li></ul>`,

        props: {
            items: Array
        },

        inject: ['keyword', 'favours'],

        methods: {
            getItemClass: function (item) {
                return `level-${item.level} `
                    + `${item.children ? 'has-child' : ''} `
                    + `${item.isCurrent ? 'current' : ''} `
                    + `${item.activated ? 'activated' : ''} `;
            },

            clickItem: function (item) {
                if (item.url) {
                    window.location.href = item.url;
                } else {
                    item.activated = !item.activated;
                }
                return false;
            },

            switchFavour: function (item) {
                item.favoured = !item.favoured;
                item.favoured
                    ? this.favours.push(item)
                    : this.favours.splice(this.favours.indexOf(item), 1);
            }
        }
    });

    app.mount('body');
});