// ============================================
// CORE FUNCTIONS
// ============================================

function proceedToCheckout() {
    if (cart.length === 0) return;

    // Render Summary di Sidebar Kanan
    renderCheckoutSummary();

    // Pindah Halaman
    navigate('checkout');

    // Init form state (reset form jika baru masuk)
    setTimeout(() => {
        updateProvinces();
        checkShippingAvailability(); // Pastikan ongkir hidden di awal
    }, 100);
}

function renderCheckoutSummary() {
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const summaryHTML = cart.map(item => `
        <div class="cart-item-preview">
            <div class="item-thumb">
                <img src="${item.image}" alt="${item.name}">
                <span class="item-badge">${item.quantity}</span>
            </div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                
                <div class="item-variant">Size: ${item.size}</div> 
                
            </div>
            <div class="item-price">IDR ${formatPrice(item.price)}</div>
        </div>
    `).join('');

    const summaryContainer = document.getElementById('checkoutSummary');
    if (summaryContainer) {
        summaryContainer.innerHTML = `
            ${summaryHTML}
            <div style="border-top: 1px solid #e1e1e1; margin-top: 20px; padding-top: 20px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; color:#737373; font-size:0.9rem;">
                    <span>Subtotal</span>
                    <span>IDR ${formatPrice(total)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; color:#737373; font-size:0.9rem;">
                    <span>Shipping</span>
                    <span style="font-size:0.8rem;" id="summaryShippingLabel">Calculated at next step</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-weight:900; font-size: 1.2rem; margin-top:20px; border-top: 1px solid #e1e1e1; padding-top:20px; align-items:center;">
                    <span>Total</span>
                    <span style="font-size: 0.9rem; font-weight: 500; color: #737373; margin-right: 10px;">IDR</span>
                    <span>${formatPrice(total)}</span>
                </div>
            </div>
        `;
    }
}

function submitOrder(event) {
    event.preventDefault();

    // Validasi akhir (double check)
    const shippingSelected = document.querySelector('input[name="shipping"]:checked');
    if (!shippingSelected) {
        alert("Please select a shipping method first.");
        return;
    }

    const btn = document.querySelector('.btn-submit-order');
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

// TAMBAHKAN Fungsi Redirect ke Shopify
function redirectToShopify() {
    if (cart.length === 0) {
        alert("CACHE IS EMPTY. SECURE ITEMS FIRST.");
        return;
    }

    // 1. Domain Shopify Kamu (Ganti dengan domain aslimu)
    const shopifyDomain = 'razrbilz.myshopify.com'; 

    // 2. Susun Link Permalink
    // Format: https://domain/cart/{id}:{qty},{id}:{qty}
    const cartParam = cart.map(item => {
        return `${item.variantId}:${item.quantity}`;
    }).join(',');

    // 3. Redirect!
    const checkoutUrl = `https://${shopifyDomain}/cart/${cartParam}`;
    
    // Debugging (Bisa dihapus nanti)
    console.log("Redirecting to:", checkoutUrl);
    
    // Buka di tab baru atau tab sama
    window.location.href = checkoutUrl;
}