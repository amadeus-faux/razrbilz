// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Preload critical images
    products.forEach(product => {
        const img = new Image();
        img.src = product.image;
    });

    // Setup form validation if on checkout page
    setupFormValidation();
    
    // Track page views (Google Analytics)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href
        });
    }
});

// Track product views
function trackProductView(productId) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'view_item', {
            items: [{
                id: productId,
                name: currentProduct ? currentProduct.name : 'Unknown'
            }]
        });
    }
}

// Track add to cart
function trackAddToCart(product) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'add_to_cart', {
            items: [{
                id: product.id,
                name: product.name,
                price: product.price
            }]
        });
    }
}