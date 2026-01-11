// ============================================
// PRODUCT DETAIL: FINAL FIXED & ROBUST
// ============================================

let currentProduct = null;
let currentTab = 'specs';
let currentSelectedSize = null;

function viewProduct(productId) {
    // 1. Reset State
    currentSelectedSize = null;
    
    // 2. Cari Produk (Gunakan '==' agar aman untuk ID angka/huruf)
    // Pastikan 'products' sudah dimuat dari products.js
    if (typeof products === 'undefined') {
        console.error("Critical Error: 'products' data is missing.");
        return;
    }

    currentProduct = products.find(p => p.id == productId);
    
    if (!currentProduct) {
        console.error("Product not found for ID:", productId);
        return;
    }
    
    // 3. Render Gallery (Panggil fungsi terpisah agar aman & responsif)
    renderGallery();
    
    // 4. Render Info Produk
    renderProductInfo();

    // 5. Setup Tombol & Navigasi
    setupAddToCartButton();

    // 6. Akhirnya, Pindah Halaman
    navigate('product-detail');
}

// ============================================
// HELPER: RENDER INFO (Memisahkan Logika HTML)
// ============================================
function renderProductInfo() {
    const info = document.getElementById('productInfo');
    const stockStatus = getStockStatus(currentProduct.stock);
    let sizeChartHTML = '';
    if (currentProduct.sizeChart && currentProduct.sizeChart.rows) {
        sizeChartHTML = currentProduct.sizeChart.rows.map(row => 
            `<tr>
                <td style="color: #fff; font-weight: bold;">${row[0]}</td>
                <td style="color: rgba(255,255,255,0.8);">${row[1]}</td>
                <td style="color: rgba(255,255,255,0.8);">${row[2]}</td>
            </tr>`
        ).join('');
    } 
    else if (currentProduct.sizeGuide) {
        sizeChartHTML = currentProduct.sizeGuide.map(s => 
            `<tr>
                <td style="color: #fff; font-weight: bold;">${s.size}</td>
                <td style="color: rgba(255,255,255,0.8);">${s.chest}</td>
                <td style="color: rgba(255,255,255,0.8);">${s.length}</td>
            </tr>`
        ).join('');
    } else {
        sizeChartHTML = '<tr><td colspan="2">Data not available</td></tr>';
    }
    // --- SELESAI PERBAIKAN ---

    info.innerHTML = `
        <div class="product-header">
            <h2 class="product-title">${currentProduct.name}</h2>
            <div class="product-meta" style="font-family: var(--font-tech); margin-bottom: 20px; opacity: 0.8;">
                <div>STATUS: <span class="${stockStatus.class}">[ ${stockStatus.status} ]</span></div>
            </div>
        </div>

        <p class="product-manifesto">${currentProduct.manifesto || "No description available."}</p>
        
        <div class="product-price-large">
            IDR ${(currentProduct.price).toLocaleString('id-ID')}
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
        
        <div class="detail-tabs">
            <button class="tab-btn active" onclick="switchTab('specs')">TECH SPECS</button>
            <button class="tab-btn" onclick="switchTab('size')">SIZE GUIDE</button>
            <button class="tab-btn" onclick="switchTab('ship')">SHIPPING</button>
        </div>

        <div id="tab-specs" class="tab-panel active">
            <div class="tech-specs">
                <ul>
                    <li>MATERIAL: ${currentProduct.specs ? currentProduct.specs.material : '-'}</li>
                    <li>WEIGHT: ${currentProduct.specs ? currentProduct.specs.weight : '-'}</li>
                    <li>FIT: ${currentProduct.specs ? currentProduct.specs.fit : '-'}</li>
                </ul>
            </div>
        </div>
        
        <div id="tab-size" class="tab-panel">
             <table class="size-table">
                <thead>
                    <tr>
                        <th style="text-align: center;">SIZE</th>
                        <th style="text-align: center;">CHEST</th>
                        <th style="text-align: center;">LENGTH</th>
                    </tr>
                </thead>
                <tbody>${sizeChartHTML}</tbody>
            </table>
        </div>
        
        <div id="tab-ship" class="tab-panel">
            <p>Standard delivery: 3-5 business days.</p>
            <p>Express deployment available at checkout.</p>
        </div>
    `;
}

function setupAddToCartButton() {
    const btn = document.querySelector('.btn-secure');
    if(btn) {
        btn.innerHTML = `[ SECURE PIECE ]`;
        btn.classList.remove('added');
        btn.onclick = function() {
            validateAndAddToCart(currentProduct);
        };
    }
}

// ============================================
// LOGIKA GALLERY (INFINITE SLIDER MOBILE)
// ============================================
function renderGallery() {
    if (!currentProduct) return;

    const gallery = document.getElementById('productGallery');
    // Deteksi Layar HP & Tablet (iPad)
    const isMobile = window.innerWidth <= 1024; 
    
    if (isMobile) {
        // --- TAMPILAN MOBILE (INFINITE SLIDER) ---
        const firstImg = currentProduct.gallery[0];
        const lastImg = currentProduct.gallery[currentProduct.gallery.length - 1];

        const slides = [
            { src: lastImg, type: 'clone-last' },     
            ...currentProduct.gallery.map(src => ({ src, type: 'real' })),
            { src: firstImg, type: 'clone-first' }    
        ];

        gallery.innerHTML = `
            <div class="gallery-container" id="mobileSlider" style="
                display: flex; 
                overflow-x: auto; 
                scroll-snap-type: x mandatory; 
                -webkit-overflow-scrolling: touch; 
                scrollbar-width: none;
            ">
                ${slides.map((slide, i) => 
                    `<img src="${slide.src}" class="gallery-image ${slide.type}" style="
                        min-width: 100%; 
                        width: 100%; 
                        flex-shrink: 0; 
                        scroll-snap-align: center; 
                        object-fit: cover;
                    ">`
                ).join('')}
            </div>

            <div class="slider-dots" id="sliderDots" style="display: flex; justify-content: center; margin-top: 15px; gap: 8px;">
                ${currentProduct.gallery.map((_, i) => 
                    `<div class="dot" data-index="${i}" style="width: 8px; height: 8px; background: ${i===0 ? '#fff' : '#333'}; border-radius: 50%; transition: all 0.3s;"></div>`
                ).join('')}
            </div>
        `;

        // Logic Slider (sama seperti sebelumnya)
        setTimeout(() => {
            const slider = document.getElementById('mobileSlider');
            if(!slider) return;
            
            const slideWidth = slider.clientWidth;
            slider.scrollLeft = slideWidth; // Start at real first item

            let isJumping = false;
            slider.addEventListener('scroll', () => {
                if(isJumping) return;
                const scrollLeft = slider.scrollLeft;
                const maxScroll = slider.scrollWidth - slider.clientWidth;

                let currentIndex = Math.round(scrollLeft / slideWidth) - 1;
                if (currentIndex < 0) currentIndex = currentProduct.gallery.length - 1;
                if (currentIndex >= currentProduct.gallery.length) currentIndex = 0;
                
                document.querySelectorAll('.slider-dots .dot').forEach((dot, index) => {
                    dot.style.background = index === currentIndex ? '#fff' : '#333';
                });

                if (Math.abs(scrollLeft - maxScroll) <= 5) {
                    isJumping = true;
                    slider.style.scrollSnapType = 'none'; 
                    slider.scrollLeft = slideWidth; 
                    requestAnimationFrame(() => { requestAnimationFrame(() => { slider.style.scrollSnapType = 'x mandatory'; isJumping = false; }); });
                } else if (scrollLeft <= 0) {
                    isJumping = true;
                    slider.style.scrollSnapType = 'none';
                    slider.scrollLeft = slider.scrollWidth - (2 * slideWidth); 
                    requestAnimationFrame(() => { requestAnimationFrame(() => { slider.style.scrollSnapType = 'x mandatory'; isJumping = false; }); });
                }
            });
        }, 50);

    } else {
        // --- TAMPILAN DESKTOP ---
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
    let src = imgSrc;
    if (typeof indexOrElement === 'object') {
        document.querySelectorAll('.gallery-thumbnail').forEach(t => t.classList.remove('active'));
        indexOrElement.classList.add('active');
        src = imgSrc;
    } else {
        src = currentProduct.gallery[indexOrElement];
    }
    const mainImage = document.querySelector('.gallery-main img');
    if (mainImage) mainImage.src = src;
}

// ============================================
// TABS & INTERAKSI
// ============================================
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if(event && event.currentTarget) event.currentTarget.classList.add('active');
    
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    const target = document.getElementById(`tab-${tabName}`);
    if(target) target.classList.add('active');
    
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
    const variantId = product.variants ? product.variants[currentSelectedSize] : null;

    if (!variantId) {
        alert("SYSTEM ERROR: VARIANT ID NOT FOUND. CONTACT ADMIN.");
        return;
    }
    addToCart(product.id, currentSelectedSize, variantId);
}

// Auto-Refresh Gallery saat Rotate Layar
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (currentProduct && document.getElementById('product-detail').classList.contains('active')) {
            renderGallery();
        }
    }, 250);
});