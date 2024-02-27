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

        template: `<aside class="sidebar">`
            + `<section id="search"><input type="text" placeholder="搜索标题" v-model="keyword"/></section>`
            + `<nav class="favours"><ul>`
            + `<li v-for="item in favours"><a class="favoured" :href="item.url">`
            + `<span v-html="item.title"/><span class="favour" @click="(evt) => switchFavour(evt, item)"/>`
            + `</a></li>`
            + `</ul></nav>`
            + `<nav class="links"><nav-menu :items="menuItems"></nav-menu></nav>`
            + `</aside>`
            + `<main><article v-html="content"/></main>`
            + `<footer>Copyright &copy; <a target="_blank" href="https://zengliwei.github.io/"><strong>Zengliwei</strong></a>. All rights reserved.</footer>`,

        data: function () {
            return {
                content: html,
                keyword: '',
                favours: [],
                menuItems: []
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
                    favours.forEach(item => {
                        this.favourUrls[item.url] = item.favoured;
                    });
                    window.localStorage.setItem('note-favours', JSON.stringify(this.favourUrls));
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
            }
        },

        created: function () {
            this.currentUrl = window.location.pathname.substr(1);
            this.favourUrls = JSON.parse(window.localStorage.getItem('note-favours')) || {};

            $.ajax('/notes/index.json').then((menuItems) => {
                this.processMenuItems(menuItems);
                this.menuItems = menuItems;
            });
        }
    });

    app.component('nav-menu', {

        template: `<ul><li v-for="item in items" :class="getItemClass(item)">`
            + `<a href="javascript:" :class="{favoured: item.favoured}" @click="clickItem(item)">`
            + `<span v-html="item.title"/>`
            + `<span v-if="item.level > 1 && item.url" class="favour" @click="(evt) => switchFavour(evt, item)"/>`
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

            switchFavour: function (evt, item) {
                evt.stopPropagation();
                item.favoured = !item.favoured;
                item.favoured
                    ? this.favours.push(item)
                    : this.favours.splice(this.favours.indexOf(item), 1);
            }
        }
    });

    app.mount('body');
});