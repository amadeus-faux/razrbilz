
function proceedToCheckout() {
    if (cart.length !== 0) {
        renderCheckoutSummary();
        navigate("checkout");
        setTimeout(() => {
            // Check shipping if relevant (removed specific functions if they were undefined in previous context, but kept structure)
            if (typeof updateProvinces === 'function') updateProvinces();
            if (typeof checkShippingAvailability === 'function') checkShippingAvailability();
        }, 100);
    }
}

function renderCheckoutSummary() {
    let totalIDR = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Generate Items HTML
    const itemsHTML = cart.map(item => `
        <div class="cart-item-preview">
            <div class="item-thumb">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <span class="item-badge">${item.quantity}</span>
            </div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-variant">Size: ${item.size}</div>
            </div>
            <div class="item-price">${formatPrice(item.price)}</div>
        </div>
    `).join("");

    const summaryContainer = document.getElementById("checkoutSummary");
    if (summaryContainer) {
        summaryContainer.innerHTML = `
            ${itemsHTML}
            <div style="border-top: 1px solid #e1e1e1; margin-top: 20px; padding-top: 20px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; color:#737373; font-size:0.9rem;">
                    <span>Subtotal</span>
                    <span>${formatPrice(totalIDR)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; color:#737373; font-size:0.9rem;">
                    <span>Shipping</span>
                    <span style="font-size:0.8rem;" id="summaryShippingLabel">Calculated at next step</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-weight:900; font-size: 1.2rem; margin-top:20px; border-top: 1px solid #e1e1e1; padding-top:20px; align-items:center;">
                    <span>Total</span>
                    <!-- Removed hardcoded IDR span -->
                    <span>${formatPrice(totalIDR)}</span>
                </div>
            </div>
        `;
    }
}

function submitOrder(e) {
    e.preventDefault();
    if (!document.querySelector('input[name="shipping"]:checked')) {
        // This logic assumed a shipping form in previous versions, preserving check
        // alert("Please select a shipping method first."); 
        // Actually, the new checkout redirects to Shopify, so this might be dead code, but keeping for safety.
    }

    const btn = document.querySelector(".btn-submit-order");
    const originalText = btn.textContent;
    btn.textContent = "PROCESSING...";
    btn.style.opacity = "0.7";
    btn.disabled = true;

    setTimeout(() => {
        alert("REDIRECTING TO PAYMENT GATEWAY...");
        btn.textContent = originalText;
        btn.style.opacity = "1";
        btn.disabled = false;
    }, 2000);
}

function redirectToShopify() {
    if (cart.length === 0) {
        alert("CACHE IS EMPTY. SECURE ITEMS FIRST.");
        return;
    }
    const variantQuery = cart.map(item => `${item.variantId}:${item.quantity}`).join(",");
    const url = `https://razrbilz.myshopify.com/cart/${variantQuery}`;
    console.log("Redirecting to:", url);
    window.location.href = url;
}

document.addEventListener('localizationChanged', () => {
    // Re-render summary if visible
    if (document.getElementById("checkout").classList.contains("active")) {
        renderCheckoutSummary();
    }
});