$(function () {
    var $nav = $('.navbar');
    var $dropmenu = $('.dropdown-menu');
    var $dropitem = $('.dropdown-item');
    var $navbarcollapse = $('.navbar-collapse');
    var topOffset = $nav.offset().top;
    var windowHeight = $(window).height();

    //initial logic in case window is not scrolled to top
    var scrollValue = $(window).scrollTop();
        $nav
            .toggleClass('affix', scrollValue > topOffset)
            .toggleClass('bg-dark', scrollValue > windowHeight);

    //these values depend on window size, so they have to be reset if someone resizes the window
    $(window).on('resize', function() {
        topOffset = $nav.offset().top;
        windowHeight = $(window).height();
    });

    //hook the scrolling so we can add/remove css classes on the navbar
    $(window).on('scroll', function (event) {
        //fix the navbar if we scroll past the original position
        //add background color if we are scrolled past the image
        var scrollValue = $(window).scrollTop();
        $nav
           .toggleClass('affix', scrollValue > topOffset)
           .toggleClass('bg-dark', scrollValue > windowHeight * .9);
        $dropmenu
           .toggleClass('bgtrans', scrollValue <= windowHeight * .9)
           .removeClass('show', scrollValue <= windowHeight * .9);
        $dropitem
           .toggleClass('bgtrans', scrollValue <= windowHeight * .9);
        $navbarcollapse
            .removeClass('show', scrollValue <=windowHeight * .9);
    });


    //handle nav anchors with fragment identifier (<url>#something)
    $('.navbar a').click(function (event) {
        var url = $(this).attr('href'),
            idx = url.indexOf("#"),
            $hash = $(url.substring(idx)),
            top = $hash.length ? $hash.offset().top - 60 : 0;
        if (idx >= 0) {
            event.preventDefault();
            $('html, body').animate({ scrollTop: top }, 500);
        }
    });
})
