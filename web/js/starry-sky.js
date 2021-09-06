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
            starNumber: 500,
            maxStartRadius: 3,
            maxStartLightRadius: 18,
            maxSpeed: 2, // degrees per second
            colors: [[240, 253, 244], [15, 221, 172], [114, 136, 255], [197, 129, 152]]
        }, options);

        let stars = [], animationId;

        const degreesToRadians = function (degrees) {
            return degrees / 360 * 2 * Math.PI;
        };

        const rand = function (min, max) {
            if (arguments.length < 2) {
                max = min;
                min = 0;
            }
            return min + Math.random() * (max - min);
        };

        const Star = function (R, D, dD, r, rg, rgb, alpha, deltaAlpha) {
            this.R = R;
            this.D = D;
            this.dD = dD;
            this.r = r;
            this.rg = rg;
            this.alpha = alpha;
            this.maxAlpha = alpha;
            this.deltaAlpha = deltaAlpha;

            this.draw = function () {
                this.D += this.dD;

                this.alpha += this.deltaAlpha;
                if (this.alpha > this.maxAlpha || this.alpha < this.maxAlpha - 0.2) {
                    this.deltaAlpha = -this.deltaAlpha;
                }

                const A = degreesToRadians(this.D);
                const x = Math.cos(A) * this.R + this.xo;
                const y = -Math.sin(A) * this.R + this.yo;
                const color = rgb.join(', ');
                const gradient = ctx.createRadialGradient(x, y, this.r, x, y, this.rg);
                gradient.addColorStop(0, 'rgba(' + color + ', 1)');
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(x, y, this.rg, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill();
            };
        };

        const initStage = function () {
            $(canvas).appendTo(self);
            canvas.height = self.outerHeight();
            canvas.width = self.outerWidth();

            for (let i = 1; i <= opts.starNumber; i++) {
                const R = canvas.width / 2 / opts.starNumber * i;
                const D = 360 / opts.starNumber * i * rand(1, 1.7);
                const dD = -opts.maxSpeed / 60 * rand(0.3, 1); // about 60 frames per second
                const r = opts.maxStartRadius / opts.starNumber * i;
                const rg = opts.maxStartLightRadius / opts.starNumber * i;
                const rgb = opts.colors[Math.floor(rand(opts.colors.length))];
                const alpha = 1 / opts.starNumber * i;
                const deltaAlpha = rand(0.002, 0.01);

                stars.push(new Star(R, D, dD, r, rg, rgb, alpha, deltaAlpha));
            }
        };

        const updateStageSize = function () {
            window.cancelAnimationFrame(animationId);

            canvas.height = self.outerHeight();
            canvas.width = self.outerWidth();

            const xo = canvas.width / 2;
            const yo = canvas.height / 2;

            for (let i = 0; i < opts.starNumber; i++) {
                stars[i].xo = xo;
                stars[i].yo = yo;
            }

            doAnimation();
        };

        const updateStage = function (evt) {

            const xo = canvas.width / 2;
            const yo = canvas.height / 2;

            const dx = evt.clientX - xo;
            const dy = evt.clientY - yo;

            for (let i = 0; i < opts.starNumber; i++) {
                stars[i].xo = xo - dx * stars[i].R * 0.0002;
                stars[i].yo = yo - dy * stars[i].R * 0.0002;
            }
        };

        const doAnimation = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < opts.starNumber; i++) {
                stars[i].draw();
            }
            animationId = window.requestAnimationFrame(doAnimation);
        };

        initStage();
        updateStageSize();
        doAnimation();

        $(window).on('resize', updateStageSize);
        $(window).on('mousemove', updateStage);

    };

});