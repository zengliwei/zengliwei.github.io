/**
 * Gallery
 */
require( [
    'jquery',
    'text!gallery/index.json',
    'mousewheel',
    'popup'
], function ( $, source ) {

    source = JSON.parse( source );

    let current = 0;
    let groups = [];
    let onAnimating = false;
    let elSections = $( 'main > .section' );
    let elNav = $( 'header nav' );

    let elLoader = $( '<div class="loader"></div>' );
    $( 'body' ).append( elLoader.hide() );

    let loadImage = function ( src ) {
        let img = new Image();
        img.src = src;

        let progress = $.Deferred();
        if ( img.complete ) {
            progress.resolve();
        }
        else {
            $( img ).on( 'load', function () {
                progress.resolve();
            } );
        }
        return { img: img, progress: progress };
    };

    let slideImages = function ( current, dir ) {
        let slideProgresses = [];
        elSections.each( function ( i, el ) {
            el = $( el );
            let orgBox = el.find( '.box' );
            let newBox = $( '<div class="box"></div>' );
            let num = current + i - 1;

            let title, cover;
            if ( num >= 0 && num < groups.length ) {
                title = groups[num]['title'];
                cover = groups[num]['cover'];
            }
            else {
                title = '浮光掠影';
                cover = 'media/gallery/default.jpg';
            }

            let html = '<h2><span><span>' + title + '</span></span></h2>' +
                '<div class="cover"><a href="javascript:;"><img src="' + cover + '" /></a></div>';
            newBox.append( html ).css( { opacity: 0, top: ( dir == 1 ? '-' : '' ) + '100%', zIndex: 2 } );
            el.append( newBox );

            let slideProgress = $.Deferred();
            slideProgresses.push( slideProgress );
            newBox.animate( { opacity: 1, top: 0 }, {
                complete: function () {
                    orgBox.remove();
                    newBox.css( { zIndex: 1 } );
                    slideProgress.resolve();
                }
            } );
            if ( i === 1 ) {
                newBox.find( 'a' ).on( 'click', function () {
                    $.fancybox.open( groups[num]['gallery'] );
                } );
            }
        } );
        $.when.apply( null, slideProgresses ).done( function () {
            onAnimating = false;
        } );
    };

    let switchGallery = function ( num ) {
        if ( num < 0 || num > groups.length - 1 ) {
            return;
        }
        if ( onAnimating ) {
            return;
        }

        let dir = current > num ? -1 : 1;
        current = num;
        onAnimating = true;

        /**
         * Load images
         */
        elLoader.show();
        let imgProgresses = [];
        elSections.each( function ( i ) {
            if ( groups[current + i] ) {
                let result = loadImage( groups[current + i]['cover'] );
                imgProgresses.push( result.progress );
            }
        } );
        $.when.apply( null, imgProgresses ).done( function () {
            elLoader.hide();
            slideImages( current, dir );
        } );
    };

    let getNumByToken = function ( token ) {
        for ( let num = 0; num < groups.length; num++ ) {
            if ( token === groups[num]['token'] ) {
                return num;
            }
        }
        return null;
    };

    let navHtml = '<ul>';
    for ( let year in source ) {
        navHtml += '<li data-role="year">' +
            '<a href="gallery/#' + year + '"><span>' + year + '</span></a>' +
            '<ul>';
        for ( let set in source[year] ) {
            let token = year + '-' + set;
            navHtml += '<li data-role="group"><a href="gallery/#' + token + '"><span>' + source[year][set]['title'] + '</span></a></li>';
            let group = {
                title: source[year][set]['title'] + ' ' + year,
                cover: 'media/gallery/' + year + '/' + set + '/cover.jpg',
                token: token,
                gallery: []
            };
            for ( let i = 0; i < source[year][set]['images'].length; i++ ) {
                group['gallery'].push( {
                    src: 'media/gallery/' + year + '/' + set + '/' + source[year][set]['images'][i]['name'],
                    opts: {
                        thumbs: { autoStart: true },
                        thumb: 'media/gallery/' + year + '/' + set + '/thumb/' + source[year][set]['images'][i]['name']
                    }
                } );
            }
            groups.push( group );
        }
        navHtml += '</ul></li>';
    }
    navHtml += '</ul>';
    elNav.html( navHtml );

    elNav.find( '[data-role=group] a' ).on( 'click', function () {
        switchGallery( getNumByToken( this.hash.substr( 1 ) ) );
    } );

    $( document ).on( 'mousewheel', function ( evt, dir ) {
        switchGallery( dir > 0 ? current - 1 : current + 1 );
    } );
    switchGallery( 0 );

} );