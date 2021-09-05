define([
    'jquery'
], function ($) {
    'use strict';

    /**
     * Build the `requestAnimationFrame` method if it does not exist
     */
    (function () {
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback) {
                return setTimeout(callback, 16);
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (animationId) {
                clearTimeout(animationId);
            };
        }
    }());

    $.fn.starrySky = function (options) {

        const self = this;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let opts = $.extend(true, {
            starNumber: 200,
            maxStartRadius: 1,
            maxStartLightRadius: 3,
            maxSpeed: 20,
            colors: [[0, 0, 255], [0, 255, 0], [255, 0, 0], [255, 255, 0]]
        }, options);

        let stars = [];

        const Star = function (ro, A, dA, r, rg, rgb) {
            this.ro = ro;
            this.A = A;
            this.dA = dA;
            this.r = r;
            this.rg = rg;

            this.draw = function () {
                this.A += this.dA;
                const x = Math.sin(this.A) * this.ro + this.xo;
                const y = Math.cos(this.A) * this.ro + this.yo;
                const color = rgb.join(', ');
                const gradient = ctx.createRadialGradient(x, y, this.r, x, y, this.rg);
                gradient.addColorStop(0, 'rgb(' + color + ')');
                gradient.addColorStop(1, 'rgba(' + color + ', 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, this.rg, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill();
            };
        };

        const rand = function (min, max) {
            max = max || min;
            min = max ? min : 0;
            return min + Math.random() * (max - min);
        };

        const initStage = function () {
            $(canvas).appendTo(self);
            canvas.height = self.outerHeight();
            canvas.width = self.outerWidth();

            for (let i = 0; i < opts.starNumber; i++) {
                const ro = canvas.width / 2 * Math.random();
                const A = rand(360) * (2 * Math.PI / 360);
                const r = opts.maxStartRadius * rand(.5, 1);
                const rg = opts.maxStartLightRadius * rand(.5, 1);
                //const dA = -(opts.maxSpeed * rand(.5, 1)) * (2 * Math.PI / 360) / ro;
                const dA = -(opts.maxSpeed) * (2 * Math.PI / 360) / ro;
                const rgb = opts.colors[Math.floor(opts.colors.length * Math.random())];

                console.log(ro);
                console.log(dA);
                console.log(r);
                console.log('------------');

                stars.push(new Star(ro, A, dA, r, rg, rgb));
            }
        };

        const updateStage = function () {
            canvas.height = self.outerHeight();
            canvas.width = self.outerWidth();
            for (let i = 0; i < opts.starNumber; i++) {
                stars[i].ro = canvas.width / 2 * Math.random();
                stars[i].xo = canvas.width / 2;
                stars[i].yo = canvas.height / 2;
            }
        };

        const doAnimation = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < opts.starNumber; i++) {
                stars[i].draw();
            }
            window.requestAnimationFrame(doAnimation);
        };

        initStage();
        updateStage();
        doAnimation();

        $(window).on('resize', updateStage);

    };

});