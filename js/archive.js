
function renderProducts() {
    const stream = document.getElementById("productStream");
    if (!stream) return;

    stream.innerHTML = "";
    products.forEach((product, index) => {
        const isSoldOut = product.stock === 0;
        const card = document.createElement("div");

        card.className = `product-card fade-in ${isSoldOut ? "sold-out" : ""}`;
        card.style.animationDelay = `${0.1 * index}s`;

        // Clean Look: Only Image + Name. 
        // Removing Code, StockStatus, and Price from display as requested.

        card.innerHTML = `
            <div class="product-image-container" ${isSoldOut ? "" : `onclick="viewProduct('${product.id}')"`} style="cursor: pointer;">
                <div class="xray-icon" 
                     onmousedown="activateXray(event)" 
                     onmouseup="deactivateXray(event)" 
                     ontouchstart="activateXray(event)" 
                     ontouchend="deactivateXray(event)" 
                     onclick="event.stopPropagation()">👁</div>
                ${isSoldOut ? '<div class="sold-out-overlay">SOLD OUT</div>' : ''}
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                <img src="${product.imageDetail}" alt="${product.name} detail" class="product-image-detail" loading="lazy">
            </div>
            <div class="data-bar" style="justify-content: center; border-top: none;">
                <div class="product-name" style="font-weight: 700; letter-spacing: 0.05em; margin-top: 10px; font-size: 0.9rem;">${product.name}</div>
            </div>
        `;
        stream.appendChild(card);
    });
}

function activateXray(e) {
    e.stopPropagation();
    const container = e.currentTarget.closest(".product-image-container");
    if (container) container.classList.add("xray-active");
}

function deactivateXray(e) {
    e.stopPropagation();
    const container = e.currentTarget.closest(".product-image-container");
    if (container) container.classList.remove("xray-active");
}

// Re-render when language/currency changes
document.addEventListener('localizationChanged', () => {
    // Only re-render if we are on the archive page or if it's visible?
    // It's safer to just re-render.
    renderProducts();
});