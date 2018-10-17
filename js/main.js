$(function () {
    //declare anything that will be used more than once
    const $nav = $('.navbar');
    const $navMenu = $('#navbarResponsive');
    const menuHeight = $nav.outerHeight();
    let topOffset = $nav.offset().top;
    let windowHeight = $(window).height();
    let scrollValue = $(window).scrollTop();

    //toggle a class on the body when the menu is open so we can apply css
    $navMenu.on('show.bs.collapse hide.bs.collapse', function(e) {
    $('body').toggleClass('open-nav', e.type === 'show');
    if (e.type == 'show' && !$nav.hasClass('bg-dark')) {
    $('body').addClass('darken-overlay');
    } else {
    $('body').removeClass('darken-overlay');
    }
    });

    //collapse the nav menu when something is clicked while it is open
    $(document).on('click', '.open-nav', function(e) {
        $navMenu.collapse('hide'); 
    });
    

    //initial logic in case window is not scrolled to top
    $nav
        .toggleClass('affix', scrollValue > topOffset)
        .toggleClass('bg-dark', scrollValue > windowHeight - menuHeight);

    //these values depend on window size, so they have to be reset if someone resizes the window
    $(window).on('resize', function() {
        topOffset = $nav.offset().top;
        windowHeight = $(window).height();
    });

    //hook the scrolling so we can add/remove css classes on the navbar
    //zoom for review section
    $(window).on('scroll', function (event) {
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();
        var viewportMiddle = (viewportTop + viewportBottom) / 2;
        var currentMiddleElement = $(document.elementFromPoint($(window).width() / 2, windowHeight / 2));

        scrollValue = $(window).scrollTop();
        $nav
            .toggleClass('affix', scrollValue >= topOffset)
            .toggleClass('bg-dark', scrollValue > windowHeight - menuHeight - 15);

        
        //apply active class to reviews when at center of window
        if (currentMiddleElement.is('.review-container') || currentMiddleElement.parent('.review-container').length) {
            $('.review-container').removeClass('active');
            currentMiddleElement.addClass('active');
        }
        });

    //handle nav anchors with fragment identifier (<url>#something)
    $nav.find('a').click(function (event) {
        var url = $(this).attr('href'),
            idx = url.indexOf("#"),
            $hash = $(url.substring(idx)),
            top = $hash.length ? $hash.offset().top - menuHeight : 0;
        if (idx >= 0) {
            event.preventDefault();
            $('html, body').animate({ scrollTop: top }, 333);
        }
    });

});