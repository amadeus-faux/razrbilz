
let cart = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || [];

const MAX_QTY_PER_VARIANT = 2;

function addToCart(productId, size, variantId) {
    const product = products.find(p => p.id == productId);
    if (product) {
        const existingItem = cart.find(item => item.variantId === variantId);

        if (existingItem) {
            if (existingItem.quantity < MAX_QTY_PER_VARIANT) {
                existingItem.quantity += 1;
                saveCart();
                updateCartCount();
                showFeedback(size, true);
            } else {
                alert("LIMIT REACHED: MAX 2 ITEMS PER SIZE PER MODEL.");
            }
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
            saveCart();
            updateCartCount();
            showFeedback(size, true);
        }
    } else {
        console.error("Cart Error: Product not found with ID", productId);
    }
}

function showFeedback(size, success) {
    const btn = document.querySelector(".btn-secure");
    if (btn) {
        btn.innerHTML = `[ SECURE: SIZE ${size} ]`;
        btn.classList.add("added");
        setTimeout(() => {
            const lang = window.appState.lang;
            const text = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang].product_secure : "[ SECURE PIECE ]";
            btn.innerHTML = text;
            btn.classList.remove("added");
        }, 2000);
    }
}

function renderCart() {
    const cartContainer = document.getElementById("cartContent");
    if (!cartContainer) return;

    // Get translations
    const lang = window.appState.lang;
    const t = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : {};
    const emptyMsg = t.cart_empty || "YOUR CACHE IS EMPTY";

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
                    
                    <div class="qty-selector" style="display:flex; align-items:center; gap:10px; margin-top:10px; margin-bottom:10px;">
                        <button onclick="updateQuantity('${item.variantId}', -1)" style="background:transparent; color:#fff; border:1px solid #555; width:25px; height:25px; cursor:pointer;">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.variantId}', 1)" style="background:transparent; color:#fff; border:1px solid #555; width:25px; height:25px; cursor:pointer;">+</button>
                    </div>

                    <button class="btn-remove" onclick="removeFromCart('${item.variantId}')">REMOVE</button>
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

function updateQuantity(variantId, change) {
    const item = cart.find(i => i.variantId === variantId);
    if (!item) return;

    const newQty = item.quantity + change;

    if (newQty > MAX_QTY_PER_VARIANT) {
        alert("LIMIT REACHED: MAX 2 ITEMS PER SIZE PER MODEL.");
        return;
    }

    if (newQty < 1) {
        return;
    }

    item.quantity = newQty;
    saveCart();
    renderCart();
}

function removeFromCart(variantId) {
    cart = cart.filter(item => item.variantId !== variantId);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateCartCount() {
    const count = document.querySelector(".cart-count");
    if (count) {
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        count.textContent = `(${totalQty})`;
    }
}

function saveCart() {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(cart));
}

document.addEventListener('localizationChanged', () => {
    renderCart();
    updateCartCount();
});