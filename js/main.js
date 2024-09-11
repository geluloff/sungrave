const sungrave = (function() {
    let resizeTimer;
    const fixedNavHeight = 80;
    const scrollSpyLinks = {};
    function windowResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleStickyNav, 250);
    }
    function handleStickyNav() {
        const el = document.getElementById("stickyPlaceholder");
        const navbar = document.getElementById("sungrave-navbar");
        const navbarContainer = document.getElementById('sungrave-nav-container');
        el.style.height = (window.innerHeight - navbarContainer.offsetHeight) + 'px';
        el.nextElementSibling.style.marginTop = '-' + el.style.height;
        const observer = new IntersectionObserver( 
            ([e]) => navbar.classList.toggle("is-pinned", e.intersectionRatio === 1),
            { threshold: [1] }
        );
        observer.observe(el);
    }
    function navLinkClick (event) {
        const url = event.target.getAttribute('href'),
            idx = url.indexOf("#"),
            targetElement = idx >= 0 ? document.getElementById(url.substring(idx + 1)) : null,
            top = targetElement ? targetElement.offsetTop - fixedNavHeight : 0;
        if (idx >= 0 && url !== '#') {
            event.preventDefault();
            window.scrollTo({top: top, behavior: 'smooth'});
        }
    }
    function navBarActiveLinkSpy() {
        const activeLinks = Object.getOwnPropertyNames(scrollSpyLinks)
            .filter(id => window.scrollY > scrollSpyLinks[id].offset);
        Object.getOwnPropertyNames(scrollSpyLinks).forEach(id => {
            scrollSpyLinks[id].link.classList.toggle('active', activeLinks.length > 0 && activeLinks[activeLinks.length - 1] === id);
        });
    }
    return {
        setUp: function() {
            handleStickyNav();
            //add or remove class to body when navbar opens or closes; close nav when body is clicked and nav is open
            var navbarToggle = document.getElementById('navbarToggle')
            navbarToggle.addEventListener('show.bs.collapse', () => document.body.classList.add('open-nav'));
            navbarToggle.addEventListener('hide.bs.collapse', () => document.body.classList.remove('open-nav'));
            document.addEventListener('click', () => document.body.classList.contains('open-nav') && bsCollapse.hide());
            //hook nav links click event to scroll with top menu offset
            const navLinks = navbarToggle.querySelectorAll('.nav-item')
            const bsCollapse = new bootstrap.Collapse(navbarToggle, {toggle:false})
            navLinks.forEach((l) => l.addEventListener('click', navLinkClick));
            //map the y axis of each link section so we can set the active nav as we scroll
            [...navLinks]
                .map(nl => nl.querySelector('.nav-link'))
                .map(l => ({ link: l, selector: l.getAttribute('href') }))
                .filter(o => o.selector.indexOf('#') === 0 && o.selector !== '#' && o.selector !== '#home')
                .map(o1 => ({ link: o1.link, section: document.getElementById(o1.selector.substring(1)) }))
                .filter(o2 => o2.section != null)
                .forEach(kvp => scrollSpyLinks[kvp.section.id] = { link: kvp.link, offset: kvp.section.offsetTop - fixedNavHeight - 10});
            //intercept fragment on page load
            if (window.location.hash) {
                const targetElement = document.getElementById(window.location.hash.substring(1));
                const top = targetElement ? targetElement.offsetTop - fixedNavHeight : 0;
                window.scrollTo({top: top, behavior: 'smooth'});
            }
            window.addEventListener('resize', windowResize);
            window.addEventListener('scroll', navBarActiveLinkSpy, { passive: true});
        }
    };
})();
document.addEventListener('DOMContentLoaded', sungrave.setUp);