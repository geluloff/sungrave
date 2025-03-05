const sungrave = (function() {
    const fixedNavHeight = 85;
    const navBarLinks = {};
    
    let resizeTimer;
    let navbarContainer; 
    let stickyNavOffset = 0;
    let navbarContainerHeight = 0;
    
    function navLinkClick (event) {
        const url = event.target.getAttribute('href') || '';
        if (url !== '#' && url.indexOf("#") === 0 && Object.keys(navBarLinks).indexOf(url.substring(1)) >= 0) {
            event.preventDefault();
            window.scrollTo({top: navBarLinks[url.substring(1)].offset, behavior: 'smooth'});
        }
    }
    function windowScroll() {
        if (window.scrollY > stickyNavOffset && !navbarContainer.parentElement.classList.contains('is-pinned')) {
            navbarContainer.parentElement.classList.add('is-pinned');
        } else if (window.scrollY <= stickyNavOffset && navbarContainer.parentElement.classList.contains('is-pinned')) {
            navbarContainer.parentElement.classList.remove('is-pinned');
        }

        const activeLinks = Object.getOwnPropertyNames(navBarLinks)
            .filter(id => id != '#home' && window.scrollY >= navBarLinks[id].offset);
        Object.getOwnPropertyNames(navBarLinks)
            .forEach(id => {
                navBarLinks[id].element.classList.toggle('active', activeLinks.length > 0 && activeLinks[activeLinks.length - 1] === id);
            });
    }
    function windowResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resetVariables, 250);
    }
    function resetVariables() {
        stickyNavOffset = window.innerHeight - navbarContainerHeight;

        //map the y axis of each link section so we can set the active nav as we scroll
        [...navbarToggle.querySelectorAll('.nav-item')]
            .map(nl => nl.querySelector('.nav-link'))
            .map(l => ({ element: l, selector: l.getAttribute('href') }))
            .filter(o => o.selector.indexOf('#') === 0 && o.selector !== '#')
            .map(o1 => ({ element: o1.element, section: document.getElementById(o1.selector.substring(1)) }))
            .filter(o2 => o2.section != null)
            .forEach(kvp => navBarLinks[kvp.section.id] = { element: kvp.element, offset: kvp.section.offsetTop - fixedNavHeight + 1 });
        
    }
    return {
        setUp: function() {
            navbarContainer = document.getElementById('sungrave-nav-container');
            navbarContainerHeight = navbarContainer.offsetHeight;

            //add or remove class to body when navbar opens or closes; close nav when body is clicked and nav is open
            var navbarToggle = document.getElementById('navbarToggle')
            navbarToggle.addEventListener('show.bs.collapse', () => document.body.classList.add('open-nav', 'darken-overlay'));
            navbarToggle.addEventListener('hide.bs.collapse', () => document.body.classList.remove('open-nav', 'darken-overlay'));
            document.addEventListener('click', () => document.body.classList.contains('open-nav') && bsCollapse.hide());

            //hook nav links click event to scroll with top menu offset
            const navLinks = navbarToggle.querySelectorAll('.nav-item')
            const bsCollapse = new bootstrap.Collapse(navbarToggle, {toggle:false})
            navLinks.forEach((l) => l.addEventListener('click', navLinkClick));

            //intercept fragment on page load
            if (window.location.hash) {
                const targetElement = document.getElementById(window.location.hash.substring(1));
                const top = targetElement ? targetElement.offsetTop - fixedNavHeight + 1 : 0;
                window.scrollTo({top: top, behavior: 'smooth'});
            }
            resetVariables();
            window.addEventListener('resize', windowResize);
            window.addEventListener('scroll', windowScroll, { passive: true});
        }
    };
})();
//document.addEventListener('DOMContentLoaded', sungrave.setUp);

document.addEventListener("DOMContentLoaded", () => {
    const hash = window.location.hash; // Store the hash for reuse

    // Define objects to show based on hash
    const dependencies = {
        "#sneakpeek": {menuIds: ['nav-listen', 'nav-about-copy'], sectionIds: ['listen', 'about-copy']}, //, optionalIds: ['past-shows']
        "#EPK": {menuIds: ['nav-downloads', 'nav-about-copy', 'nav-shows'], sectionIds: ['downloads', 'about-copy', 'shows'], tableElements: ['attending-header', 'attending-column']} //, optionalIds: ['past-shows']
    };

    // Default case when no hash is present
    const defaultDependency = {menuIds: ['nav-about', 'nav-merch', 'nav-shows'], sectionIds: ['about', 'shows']};

    // Determine the appropriate dependency
    const dependency = dependencies[hash] || defaultDependency;
    
    if (dependency) {
        // Unhide the menu items
        dependency.menuIds.forEach(menuId => {
            document.getElementById(menuId)?.classList.remove("hidden");
        });

        // Unhide the sections
        dependency.sectionIds.forEach(sectionId => {
            document.getElementById(sectionId)?.classList.remove("hidden");
        });
    
        // Unhide optional sections
        dependency.optionalIds?.forEach(optionalId => {
            document.getElementById(optionalId)?.classList.remove("hidden");
        });

        // Unhide attending column elements if applicable
        dependency.tableElements?.forEach(tableElement => {
            document.querySelectorAll(`.${tableElement}, #${tableElement}`).forEach(el => el.classList.remove("hidden"));
        });
    }

    // Check if the current page is listen.html
    if (window.location.pathname.includes("listen.html")) {
        const navbar = document.getElementById("sungrave-nav-container");
        if (navbar) {
            navbar.parentElement.classList.add("is-pinned");
        }
    }

    // Call sungrave.setUp after handling hash navigation
    sungrave.setUp();
});

document.addEventListener("DOMContentLoaded", function () {
    const upcomingShows = document.getElementById("upcoming-shows");
    const pastShows = document.getElementById("past-shows");
    const upcomingBtn = document.getElementById("show-upcoming-btn");
    const pastBtn = document.getElementById("show-past-btn");

    // Ensure past shows are hidden initially
    pastShows.style.display = "none";

    upcomingBtn.addEventListener("click", function () {
        upcomingShows.style.display = "block";
        pastShows.style.display = "none";
        upcomingBtn.classList.add("active");
        pastBtn.classList.remove("active");
    });

    pastBtn.addEventListener("click", function () {
        upcomingShows.style.display = "none";
        pastShows.style.display = "block";
        pastBtn.classList.add("active");
        upcomingBtn.classList.remove("active");
    });
});

