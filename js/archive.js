// ============================================
// ARCHIVE: Render Products with Live Stock
// ============================================

function renderProducts() {
    const stream = document.getElementById('productStream');
    if (!stream) return;
    
    stream.innerHTML = '';
    
    products.forEach((product, index) => {
        const stockInfo = getStockStatus(product.stock);
        const isSoldOut = product.stock === 0;
        
        const card = document.createElement('div');
        card.className = `product-card fade-in ${isSoldOut ? 'sold-out' : ''}`;
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="product-image-container" 
                 ${!isSoldOut ? `onclick="viewProduct('${product.id}')"` : ''}
                 style="cursor: pointer;"> 
                
                <div class="xray-icon"
                     onmousedown="activateXray(event)" 
                     onmouseup="deactivateXray(event)"
                     ontouchstart="activateXray(event)"
                     ontouchend="deactivateXray(event)"
                     onclick="event.stopPropagation()">
                     👁
                </div>

                <img src="${product.image}" alt="${product.name}" class="product-image">
                <img src="${product.imageDetail}" alt="${product.name} detail" class="product-image-detail">
            </div>

            <div class="data-bar">
                <div class="product-code">CODE: ${product.code}</div>
                <div>
                    STOCK: <span class="stock-indicator ${stockInfo.class}">[ ${stockInfo.status} ]</span>
                    ${product.stock > 0 && product.stock <= 25 ? `<span style="opacity: 0.7; font-size: 0.75rem;"></span>` : ''}
                </div>
                <div class="price-tag">IDR ${product.price.toLocaleString('id-ID')}</div>
            </div>
        `;
        
        stream.appendChild(card);
    });
}

// X-RAY: Tactile Effect (Diperbarui)
function activateXray(event) {
    // Mencegah klik tembus ke gambar belakangnya
    event.stopPropagation(); 
    const icon = event.currentTarget;
    const container = icon.closest('.product-image-container');
    
    if (container) {
        container.classList.add('xray-active');
    }
}

function deactivateXray(event) {
    event.stopPropagation();
    
    const icon = event.currentTarget;
    const container = icon.closest('.product-image-container');
    
    if (container) {
        container.classList.remove('xray-active');
    }
}