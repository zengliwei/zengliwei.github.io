define( [
    'jquery',
    'markdown',
    'scrollbar',
    'js/reading-progress'
], function( $, markdown ) {

    /**
     * @param {function} requestFunction A function with `path` and `defer` parameters
     * @return {function} A function with `key` and `callback` parameters
     */
    var createPromiseCaches = function( requestFunction ) {
        var promiseCaches = {};
        return function( key, callback ) {
            if ( !promiseCaches[ key ] ) {
                promiseCaches[ key ] = $.Deferred( function( defer ) {
                    requestFunction( key, defer );
                } ).promise();
            }
            return promiseCaches[ key ].done( function( response ) {
                callback( key, response );
            } );
        };
    };

    /**
     * @param {string} str
     * @return {string}
     */
    var encodeHtml = function( str ) {
        return str.replace( /&/g, '&amp;' )
                .replace( /</g, '&lt;' )
                .replace( />/g, '&gt;' )
                .replace( /"/g, '&quot;' )
                .replace( /'/g, '&apos;' );
    };

    return function( options ) {

        var opts = $.extend( true, {
            config: {},
            elMenuBox: null,
            elNavBox: null,
            elMainBox: null,
            elIndexBox: null,
            githubApiUrl: 'https://api.github.com',
            githubOwner: null,
            githubRepository: null
        }, options );

        var body = $( 'body' );
        var elMenuBox = $( opts.elMenuBox );
        var elNavBox = $( opts.elNavBox );
        var elMainBox = $( opts.elMainBox );
        var loader;

        var markdownConverter = new markdown.Converter();

        /**
         * @param {boolean} flag
         */
        var loading = function( flag ) {
            if ( flag === false ) {
                loader.hide();
            } else {
                loader.show();
            }
        };

        /**
         * @param {string} hash
         * @return {string} path
         */
        var getPathByHash = function( hash ) {
            return (hash && hash.indexOf( '#' ) === 0) ? hash.substr( 1 ) : '';
        };

        /**
         * @param {string} menuName
         * @param {object} data
         * @return {string} HTML
         */
        var getMenuHtml = function( menuName, data ) {
            var html = '<ul>';
            for ( var i = 0; i < data.length; i++ ) {
                html += '<li>' +
                        '<a href="' + (data[i].href || 'javascript:;') + '"' +
                        ' id="' + menuName + '-' + encodeHtml( data[i].name.replace( /\//g, '-' ) ) + '"' +
                        ' data-identifier="' + encodeHtml( data[i].name ) + '"' +
                        (data[i].children ? (' data-children="' + encodeHtml( JSON.stringify( data[i].children ) ) + '"') : '') +
                        '><span>' + data[i].title + '</span></a>' +
                        (data[i].children ? getMenuHtml( menuName, data[i].children ) : '') +
                        '</li>';
            }
            html += '</ul>';
            return html;
        };

        /**
         * @param {string} path
         */
        var updateMenuBox = function( path ) {
            elMenuBox.find( '#main-menu-' + path.split( '/' )[0] )
                    .closest( 'li' ).addClass( 'current' )
                    .siblings().removeClass( 'current' );
        };

        /**
         * @param {string} path
         */
        var updateNavBox = function( path ) {
            var data = elMenuBox.find( '#main-menu-' + path.split( '/' )[0] ).data( 'children' );
            if ( data ) {
                elNavBox.html( getMenuHtml( 'nav-menu', data ) );
            } else {
                elNavBox.html( '' );
            }
            elNavBox.find( '#nav-menu-' + path.replace( /\//g, '-' ) )
                    .closest( 'li' ).addClass( 'current' )
                    .siblings().removeClass( 'current' );
        };

        /**
         * @param {string} content
         */
        var updateMainBox = function( content ) {
            elMainBox.html( '<div class="markdown">' + markdownConverter.makeHtml( content ) + '</div>' ).readingProgress( 'update' );
            elMainBox.find( 'pre' ).mCustomScrollbar( {horizontalScroll: true, theme: 'minimal-dark'} );
        };

        /**
         * @param {string} path
         * @param {string} content
         */
        var updateStage = function( path, content ) {
            updateMenuBox( path );
            updateNavBox( path );
            updateMainBox( content );
        };

        var buildNavBox = function() {
            elNavBox.append( '<div class="box"></div>' ).mCustomScrollbar( {theme: 'minimal-dark'} );
            elNavBox = elNavBox.find( '.box' );
        };

        var buildMenuBox = function() {
            var elMenuBoxWrapper = elMenuBox;
            elMenuBox.append( '<div class="box"></div>' )
                    .mCustomScrollbar( {theme: 'minimal-dark'} )
                    .append( '<div class="toggler"></div>' );
            elMenuBox = elMenuBox.find( '.box' );
            elMenuBox.html( getMenuHtml( 'main-menu', opts.config ) ).on( 'click', 'a', function( evt ) {
                evt.stopPropagation();
                var el = $( this );
                var children = el.data( 'children' );
                if ( children ) {
                    updateNavBox( el.data( 'identifier' ) );
                } else {
                    elMenuBoxWrapper.removeClass( 'active' );
                    parsePath( getPathByHash( this.hash ), updateStage );
                }
            } );
            elMenuBoxWrapper.on( 'click', function() {
                elMenuBoxWrapper.removeClass( 'active' );
            } ).find( '.toggler' ).on( 'click', function( evt ) {
                evt.stopPropagation();
                elMenuBoxWrapper.toggleClass( 'active' );
            } );
        };

        var buildIndexBox = function() {
            elMainBox.readingProgress( {
                elProgressBox: opts.elIndexBox,
                startTop: body.find( '> .header-wrapper' ).outerHeight()
            } );
        };

        var buildLoader = function() {
            loader = $( '<div class="loader"></loader>' );
            body.append( loader );
        };

        var parsePath = createPromiseCaches( function( path, defer ) {
            loading( true );
            $.get( 'data/' + path + '.md' ).then( defer.resolve, defer.reject ).always( function() {
                loading( false );
            } );
        } );

        buildMenuBox();
        buildNavBox();
        buildIndexBox();
        buildLoader();

        parsePath( getPathByHash( window.location.hash || '#home' ), updateStage );

        $( opts.elNavBox + ',' + opts.elMainBox ).on( 'click', 'a', function() {
            if ( this.hash ) {
                parsePath( getPathByHash( this.hash ), updateStage );
            }
        } );

    };

} );