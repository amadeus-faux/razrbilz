// ============================================
// CART MANAGEMENT
// ============================================
let cart = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || [];

function addToCart(productId, selectedSize) {
    // FIX: Gunakan '==' agar cocok meskipun tipe datanya beda (String vs Number)
    const product = products.find(p => p.id == productId);
    
    if (!product) {
        console.error("Cart Error: Product not found with ID", productId);
        return;
    }

    // Cek item yang sama (ID & Size sama)
    const existingItem = cart.find(item => item.id == productId && item.size === selectedSize);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            size: selectedSize
        });
    }

    saveCart();
    updateCartCount();

    // Feedback Visual Tombol
    const btn = document.querySelector('.btn-secure');
    if(btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = `[ SECURE: SIZE ${selectedSize} ]`;
        btn.classList.add('added');
        
        setTimeout(() => {
            btn.innerHTML = `[ SECURE PIECE ]`;
            btn.classList.remove('added');
        }, 2000);
    }
}

function renderCart() {
    const content = document.getElementById('cartContent');
    if (!content) return;
    
    if (cart.length === 0) {
        content.innerHTML = '<p class="cart-empty">YOUR CACHE IS EMPTY</p>';
        return;
    }
    
    let total = 0;
    const itemsHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-variant">SIZE: ${item.size}</div>
                    <div class="cart-item-price">IDR ${formatPrice(item.price)}</div>
                    <button class="btn-remove" onclick="removeFromCart(${item.id})">REMOVE</button>
                </div>
            </div>
        `;
    }).join('');
    
    content.innerHTML = `
        <div class="cart-items">${itemsHTML}</div>
        <div class="cart-total">TOTAL: IDR ${formatPrice(total)}</div>
        <button class="btn-checkout" onclick="proceedToCheckout()">[ PROCEED TO SECUREMENT ]</button>
    `;
}

function removeFromCart(productId) {
    // FIX: Gunakan != untuk filtering yang aman
    cart = cart.filter(item => item.id != productId);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateCartCount() {
    const countElement = document.querySelector('.cart-count');
    if(countElement) {
        countElement.textContent = `(${cart.length})`;
    }
}

function saveCart() {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(cart));
}