// ============================================
// PRODUCT DETAIL WITH TAB SYSTEM & RESPONSIVE GALLERY
// ============================================

let currentProduct = null;
let currentTab = 'specs';
let currentImageIndex = 0;
let currentSelectedSize = null;

function viewProduct(productId) {
    // 1. Reset size saat buka produk baru
    currentSelectedSize = null;

    // FIX 1: HAPUS baris 'products = ...' yang menyebabkan crash.
    // Kita tidak perlu load ulang inventory karena 'products.js' sudah menanganinya secara global.
    
    // Cari produk berdasarkan ID (gunakan '==' agar cocok angka maupun string)
    currentProduct = products.find(p => p.id == productId);
    
    if (!currentProduct) {
        console.error("Product not found for ID:", productId);
        return;
    }
    
    // FIX 2: Gunakan 'currentProduct.stock' (bukan stockQty)
    const stockStatus = getStockStatus(currentProduct.stock);

    // Render Gallery
    const gallery = document.getElementById('productGallery');
    gallery.innerHTML = `
        <div class="gallery-main">
            <img src="${currentProduct.image}" alt="${currentProduct.name}">
        </div>
        <div class="gallery-thumbnails">
            ${currentProduct.gallery.map((img, index) => `
                <div class="gallery-thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage(this, '${img}')">
                    <img src="${img}">
                </div>
            `).join('')}
        </div>
    `;
    
    // Render Info
    const info = document.getElementById('productInfo');
    
    // FIX 3: Perbaikan variabel status agar tidak muncul "undefined"
    // Gunakan 'stockStatus.status' dan 'currentProduct.stock'
    info.innerHTML = `
        <div class="product-header">
            <h2 class="product-title">${currentProduct.name}</h2>
        </div>

        <p class="product-manifesto">${currentProduct.manifesto}</p>
        
        <div class="product-price-large">
            IDR ${(currentProduct.price / 1000).toFixed(0)}K
        </div>

        <div class="size-selector-container">
            <span class="size-label">SELECT SIZE CONFIGURATION:</span>
            <div class="size-grid">
                <button class="size-btn" onclick="selectSize(this, 'S')">S</button>
                <button class="size-btn" onclick="selectSize(this, 'M')">M</button>
                <button class="size-btn" onclick="selectSize(this, 'L')">L</button>
                <button class="size-btn" onclick="selectSize(this, 'XL')">XL</button>
                <button class="size-btn" onclick="selectSize(this, '2XL')">2XL</button>
            </div>
        </div>
        
        <div class="product-command-center">
            <nav class="tab-navigation">
                <button class="tab-btn active" onclick="switchTab('specs')">SPECS</button>
                <button class="tab-btn" onclick="switchTab('size')">SIZE</button>
                <button class="tab-btn" onclick="switchTab('shipping')">SHIP</button>
            </nav>

            <div class="tab-content">
                <!-- SPECS TAB -->
                <div id="tab-specs" class="tab-panel tech-specs active">
                    <h3>TECHNICAL SPECIFICATIONS</h3>
                    <ul>
                        <li>MATERIAL: ${currentProduct.specs.material}</li>
                        <li>WEIGHT: ${currentProduct.specs.weight}</li>
                        <li>FIT: ${currentProduct.specs.fit}</li>
                        <li>FEATURES: ${currentProduct.specs.features}</li>
                    </ul>
                </div>

                <!-- SIZE TAB -->
                <div id="tab-size" class="tab-panel size-guide-tab">
                    <h4>SIZE CHART</h4>
                    <table>
                        <thead>
                            <tr>
                                ${currentProduct.sizeChart.headers.map(h => `<th>${h}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${currentProduct.sizeChart.rows.map(row => 
                                `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
                            ).join('')}
                        </tbody>
                    </table>

                    <div class="size-guide-instructions">
                        ${currentProduct.sizeRef}
                    </div>
                </div>

                <!-- SHIPPING TAB -->
                <div id="tab-shipping" class="tab-panel shipping-info">
                    <div class="shipping-option">
                        <h4>PROCESSING TIME</h4>
                        <p>Orders processed within 14-20 business days. Tracking number sent via email.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Reset tombol Add to Cart
    const btn = document.querySelector('.btn-secure');
    if(btn) {
        btn.innerHTML = `[ SECURE PIECE ]`;
        btn.classList.remove('added');
        btn.onclick = function() {
            validateAndAddToCart(currentProduct);
        };
    }

    // Akhirnya, pindah halaman
    navigate('product-detail');
}

function renderGallery() {
    if (!currentProduct) return;

    const gallery = document.getElementById('productGallery');
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        gallery.innerHTML = `
            <div class="gallery-container" style="display: flex; overflow-x: auto; gap: 10px; scroll-snap-type: x mandatory;">
                ${currentProduct.gallery.map((img, index) => 
                    `<img src="${img}" alt="${currentProduct.name}" class="gallery-image" style="width: 100%; flex-shrink: 0; scroll-snap-align: center; border-radius: 4px;">`
                ).join('')}
            </div>
        `;
    } else {
        gallery.innerHTML = `
            <div class="gallery-main">
                <img src="${currentProduct.gallery[0]}" alt="${currentProduct.name}" id="mainImage">
            </div>
            <div class="gallery-thumbnails">
                ${currentProduct.gallery.map((img, index) => 
                    `<div class="gallery-thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage(this, '${img}')">
                        <img src="${img}" alt="Thumbnail">
                    </div>`
                ).join('')}
            </div>
        `;
    }
}

function changeMainImage(indexOrElement, imgSrc) {
    // Handle overload: bisa dipanggil dengan index (int) atau element (object)
    let src = imgSrc;
    let index = indexOrElement;
    
    if (typeof indexOrElement === 'object') {
        // Jika dipanggil dari HTML onclick="changeMainImage(this, 'url')"
        document.querySelectorAll('.gallery-thumbnail').forEach(t => t.classList.remove('active'));
        indexOrElement.classList.add('active');
        src = imgSrc;
    } else {
        // Jika dipanggil dari logic renderGallery
        src = currentProduct.gallery[index];
    }
    
    const mainImage = document.querySelector('.gallery-main img');
    if (mainImage) mainImage.src = src;
}

function switchTab(tabName) {
    // 1. Reset tombol navigasi
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Aktifkan tombol yang diklik (menggunakan event global)
    if(event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    
    // 2. Sembunyikan semua panel isinya saja
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
        // HAPUS baris style.display = 'none' manual disini biar CSS yang mengatur
    });
    
    // HAPUS total baris yang menyembunyikan '.tab-content' (ini biang keroknya)
    
    // 3. Munculkan panel yang dituju
    const target = document.getElementById(`tab-${tabName}`);
    if(target) {
        target.classList.add('active');
    }
    
    currentTab = tabName;
}

function selectSize(btnElement, size) {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
    btnElement.classList.add('selected');
    currentSelectedSize = size;
}

function validateAndAddToCart(product) {
    if (!currentSelectedSize) {
        alert("SYSTEM ALERT: PLEASE SELECT A SIZE CONFIGURATION.");
        return;
    }
    addToCart(product.id, currentSelectedSize);
}

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const detailPage = document.getElementById('product-detail');
        if (currentProduct && detailPage && !detailPage.classList.contains('hidden')) {
            renderGallery();
        }
    }, 250);
});