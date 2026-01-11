
let cart = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || [];

function addToCart(productId, size, variantId) {
    const product = products.find(p => p.id == productId);
    if (product) {
        const existingItem = cart.find(item => item.id == productId && item.size === size);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                variantId: variantId,
                quantity: 1,
                size: size
            });
        }
        saveCart();
        updateCartCount();

        // UI Feedback
        const btn = document.querySelector(".btn-secure");
        if (btn) {
            btn.innerHTML = `[ SECURE: SIZE ${size} ]`;
            btn.classList.add("added");
            setTimeout(() => {
                // Restore button text based on current language
                const lang = window.appState.lang;
                // Safely access translations if available, else fallback
                const text = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang].product_secure : "[ SECURE PIECE ]";
                btn.innerHTML = text;
                btn.classList.remove("added");
            }, 2000);
        }
    } else {
        console.error("Cart Error: Product not found with ID", productId);
    }
}

function renderCart() {
    const cartContainer = document.getElementById("cartContent");
    if (!cartContainer) return;

    // Get translations
    const lang = window.appState.lang;
    const t = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : {};
    const emptyMsg = t.cart_empty || "YOUR CACHE IS EMPTY";
    const checkoutBtn = t.btn_checkout || "[ PROCEED TO SECUREMENT ]"; // Fallback differently for cart button? index.html uses btn_checkout but maybe cart had different text. 
    // Wait, index.html used nav keys. 
    // Let's use "[ PROCEED TO SECUREMENT ]" or reuse `checkout_proceed`? 
    // The previous code had "[ PROCEED TO SECUREMENT ]". 
    // I added `btn_checkout` ("PROCEED TO CHECKOUT") to translation.js. I'll use that for consistency.

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p class="cart-empty" data-i18n="cart_empty">${emptyMsg}</p>`;
        return;
    }

    let totalIDR = 0;
    const cartItemsHTML = cart.map(item => {
        totalIDR += item.price * item.quantity;
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" loading="lazy">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-variant">SIZE: ${item.size}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <button class="btn-remove" onclick="removeFromCart(${item.id})">REMOVE</button>
                </div>
            </div>
        `;
    }).join("");

    cartContainer.innerHTML = `
        <div class="cart-items">${cartItemsHTML}</div>
        <div class="cart-total">TOTAL: ${formatPrice(totalIDR)}</div>
        <button class="btn-checkout" onclick="proceedToCheckout()">${t.btn_checkout || "[ PROCEED TO CHECKOUT ]"}</button>
    `;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateCartCount() {
    const count = document.querySelector(".cart-count");
    if (count) {
        count.textContent = `(${cart.length})`;
    }
}

function saveCart() {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(cart));
}

document.addEventListener('localizationChanged', () => {
    renderCart();
    updateCartCount();
});