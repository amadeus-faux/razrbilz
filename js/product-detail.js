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
    info.innerHTML = `
        <div class="product-header">
            <h2 class="product-title">${currentProduct.name}</h2>
        </div>
        <p class="product-manifesto">${currentProduct.manifesto}</p>
        <div class="price-tag">IDR ${product.price.toLocaleString('id-ID')}</div>
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
    // Deteksi Layar HP & Tablet (iPad)
    const isMobile = window.innerWidth <= 1024; 
    
    if (isMobile) {
        // --- TAMPILAN MOBILE (INFINITE SLIDER) ---
        
        // 1. Siapkan Clone (Bayangan)
        // Clone Last -> Taruh di depan (untuk swipe ke kiri mentok)
        // Clone First -> Taruh di belakang (untuk swipe ke kanan mentok)
        const firstImg = currentProduct.gallery[0];
        const lastImg = currentProduct.gallery[currentProduct.gallery.length - 1];

        // Susunan: [Clone Last] - [Real 1] - [Real 2] - [Real 3] - [Clone First]
        const slides = [
            { src: lastImg, type: 'clone-last' },     
            ...currentProduct.gallery.map(src => ({ src, type: 'real' })),
            { src: firstImg, type: 'clone-first' }    
        ];

        // 2. Render HTML
        // Kita tambahkan Container Slider + Dots Indicator
        gallery.innerHTML = `
            <div class="gallery-container" id="mobileSlider" style="
                display: flex; 
                overflow-x: auto; 
                scroll-snap-type: x mandatory; 
                -webkit-overflow-scrolling: touch; /* Smooth scroll di iOS */
                scrollbar-width: none; /* Sembunyikan scrollbar */
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

            <div class="slider-dots" id="sliderDots" style="
                display: flex; 
                justify-content: center; 
                margin-top: 15px; 
                gap: 8px;
            ">
                ${currentProduct.gallery.map((_, i) => 
                    `<div class="dot" data-index="${i}" style="
                        width: 8px; 
                        height: 8px; 
                        background: ${i===0 ? '#fff' : '#333'}; 
                        border-radius: 50%;
                        transition: all 0.3s;
                    "></div>`
                ).join('')}
            </div>
        `;

        // 3. Pasang Logika Infinite Loop
        const slider = document.getElementById('mobileSlider');
        
        // Tunggu sebentar agar elemen ter-render sempurna
        setTimeout(() => {
            if(!slider) return;
            const slideWidth = slider.clientWidth;
            
            // A. Posisi Awal: Langsung lompat ke Index 1 (Gambar Asli Pertama)
            // Karena Index 0 adalah Clone Last
            slider.scrollLeft = slideWidth; 

            let isJumping = false;

            slider.addEventListener('scroll', () => {
                if(isJumping) return;

                const scrollLeft = slider.scrollLeft;
                const maxScroll = slider.scrollWidth - slider.clientWidth;

                // B. Update Dots Indicator
                // Rumus: (ScrollPosisi / Lebar) - 1 (karena ada clone di depan)
                let currentIndex = Math.round(scrollLeft / slideWidth) - 1;
                // Safety check index
                if (currentIndex < 0) currentIndex = currentProduct.gallery.length - 1;
                if (currentIndex >= currentProduct.gallery.length) currentIndex = 0;
                updateDots(currentIndex);

                // C. Logika Lompat (Teleport)
                
                // Jika mentok KANAN (kena Clone First) -> Lompat ke Real First (Kiri)
                // Buffer 5px untuk toleransi
                if (Math.abs(scrollLeft - maxScroll) <= 5) {
                    isJumping = true;
                    slider.style.scrollSnapType = 'none'; // Matikan snap biar lompat instan
                    slider.scrollLeft = slideWidth; // Lompat ke Index 1
                    // Nyalakan snap lagi
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            slider.style.scrollSnapType = 'x mandatory';
                            isJumping = false;
                        });
                    });
                }
                
                // Jika mentok KIRI (kena Clone Last) -> Lompat ke Real Last (Kanan)
                else if (scrollLeft <= 0) {
                    isJumping = true;
                    slider.style.scrollSnapType = 'none';
                    // Lompat ke posisi (TotalPanjang - 2 * LebarSlide)
                    slider.scrollLeft = slider.scrollWidth - (2 * slideWidth); 
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            slider.style.scrollSnapType = 'x mandatory';
                            isJumping = false;
                        });
                    });
                }
            });
        }, 50);

    } else {
        // --- TAMPILAN DESKTOP (Grid PC) ---
        // Kode lama tetap dipertahankan
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

// Fungsi Helper untuk Update Warna Titik
function updateDots(activeIndex) {
    const dots = document.querySelectorAll('.slider-dots .dot');
    dots.forEach((dot, index) => {
        dot.style.background = index === activeIndex ? '#fff' : '#333'; // Putih aktif, Abu mati
    });
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