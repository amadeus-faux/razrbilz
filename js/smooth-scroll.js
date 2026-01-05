// ============================================
// SMOOTH GRAVITATIONAL SCROLLING
// ============================================

// Using Lenis for smooth scroll
// CDN: https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.27/dist/lenis.min.js

let lenis;

function initSmoothScroll() {
    // Initialize Lenis
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // Scroll progress indicator
    lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
        const indicator = document.querySelector('.scroll-indicator');
        if (indicator) {
            indicator.style.transform = `scaleX(${progress})`;
        }
    });

    // Request animation frame
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}

// Disable smooth scroll on specific elements (like portal)
function disableSmoothScrollOnPortal() {
    const portal = document.getElementById('portal');
    if (portal) {
        portal.setAttribute('data-lenis-prevent', '');
    }
}

// Initialize on load
if (typeof Lenis !== 'undefined') {
    initSmoothScroll();
    disableSmoothScrollOnPortal();
}
