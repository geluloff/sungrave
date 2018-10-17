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
        var element1Top = $('#review1').offset().top;
        var element1Height = $('#review1').outerHeight();
        var element2Top = $('#review2').offset().top;
        var element2Height = $('#review2').outerHeight();
        var element3Top = $('#review3').offset().top;
        var element3Height = $('#review3').outerHeight();
        var element4Top = $('#review4').offset().top;
        var element4Height = $('#review4').outerHeight();
        var element5Top = $('#review5').offset().top;
        var element5Height = $('#review5').outerHeight();
        var element6Top = $('#review6').offset().top;
        var element6Height = $('#review6').outerHeight();
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();
        var viewportMiddle = (viewportTop + viewportBottom) / 2;

        scrollValue = $(window).scrollTop();
        $nav
            .toggleClass('affix', scrollValue >= topOffset)
            .toggleClass('bg-dark', scrollValue > windowHeight - menuHeight - 15);

        //stop zooming after the entire div has crossed the center
        $(".zoom1").css({backgroundSize: (100 + Math.min(Math.max(0, viewportMiddle - element1Top), element1Height)/20)  + "%",});
        $(".zoom2").css({backgroundSize: (100 + Math.min(Math.max(0, viewportMiddle - element2Top), element2Height)/20)  + "%",});
        $(".zoom3").css({backgroundSize: (100 + Math.min(Math.max(0, viewportMiddle - element3Top), element3Height)/20)  + "%",});
        $(".zoom4").css({backgroundSize: (100 + Math.min(Math.max(0, viewportMiddle - element4Top), element4Height)/20)  + "%",});
        $(".zoom5").css({backgroundSize: (100 + Math.min(Math.max(0, viewportMiddle - element5Top), element5Height)/20)  + "%",});
        $(".zoom6").css({backgroundSize: (100 + Math.min(Math.max(0, viewportMiddle - element6Top), element6Height)/20)  + "%",});
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