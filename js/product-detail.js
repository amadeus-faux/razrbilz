
let currentProduct = null;
let currentTab = "specs";
let currentSelectedSize = null;

function viewProduct(id) {
    currentSelectedSize = null;
    if (typeof products !== "undefined") {
        currentProduct = products.find(p => p.id == id);
        if (currentProduct) {
            renderGallery();
            renderProductInfo();
            setupAddToCartButton();
            navigate("product-detail");
            return;
        }
        console.error("Product not found for ID:", id);
    } else {
        console.error("Critical Error: 'products' data is missing.");
    }
}

function renderProductInfo() {
    const container = document.getElementById("productInfo");
    if (!container || !currentProduct) return;

    const stockStatus = getStockStatus(currentProduct.stock);

    // Get translations
    const lang = window.appState.lang;
    const t = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : {};

    // Generate Size Table
    let sizeTableRows = "";
    if (currentProduct.sizeChart && currentProduct.sizeChart.rows) {
        sizeTableRows = currentProduct.sizeChart.rows.map(row =>
            `<tr>
                <td style="color: #fff; font-weight: bold;">${row[0]}</td>
                <td style="color: rgba(255,255,255,0.8);">${row[1]}</td>
                <td style="color: rgba(255,255,255,0.8);">${row[2]}</td>
            </tr>`
        ).join("");
    } else {
        sizeTableRows = '<tr><td colspan="2">Data not available</td></tr>';
    }

    container.innerHTML = `
        <div class="product-header">
            <h2 class="product-title">${currentProduct.name}</h2>
            <div class="product-meta" style="font-family: var(--font-tech); margin-bottom: 20px; opacity: 0.8;">
                <div>STATUS: <span class="${stockStatus.class}">[ ${stockStatus.status} ]</span></div>
            </div>
        </div>
        </div>
        <p class="product-manifesto">${(currentProduct.manifesto && currentProduct.manifesto[lang]) ? currentProduct.manifesto[lang] : (currentProduct.manifesto.en || "No description available.")}</p>
        
        <div class="product-price-large">${formatPrice(currentProduct.price)}</div>
        
        <div class="size-selector-container">
            <span class="size-label" data-i18n="product_select_size_label">${t.product_select_size_label || "SELECT SIZE CONFIGURATION:"}</span>
            <div class="size-grid">
                <button class="size-btn" onclick="selectSize(this, 'S')">S</button>
                <button class="size-btn" onclick="selectSize(this, 'M')">M</button>
                <button class="size-btn" onclick="selectSize(this, 'L')">L</button>
                <button class="size-btn" onclick="selectSize(this, 'XL')">XL</button>
                <button class="size-btn" onclick="selectSize(this, '2XL')">2XL</button>
            </div>
        </div>

        <div class="detail-tabs">
            <button class="tab-btn active" onclick="switchTab('specs')">${t.tab_specs || "TECH SPECS"}</button>
            <button class="tab-btn" onclick="switchTab('size')">${t.tab_size || "SIZE GUIDE"}</button>
            <button class="tab-btn" onclick="switchTab('ship')">${t.tab_ship || "SHIPPING"}</button>
        </div>

        <div id="tab-specs" class="tab-panel active">
            <div class="tech-specs">
                <ul>
                    <li>MATERIAL: ${currentProduct.specs ? currentProduct.specs.material : "-"}</li>
                    <li>WEIGHT: ${currentProduct.specs ? currentProduct.specs.weight : "-"}</li>
                    <li>FIT: ${currentProduct.specs ? currentProduct.specs.fit : "-"}</li>
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
                <tbody>
                    ${sizeTableRows}
                </tbody>
            </table>
        </div>

        <div id="tab-ship" class="tab-panel">
            ${t.shipping_info || "<p>Standard delivery: 3-5 business days.</p>"}
        </div>
    `;
}

function setupAddToCartButton() {
    const btn = document.querySelector(".btn-secure");
    if (btn) {
        const lang = window.appState.lang;
        const t = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : {};
        btn.innerHTML = t.product_secure || "[ SECURE PIECE ]";
        btn.classList.remove("added");
        btn.onclick = function () {
            validateAndAddToCart(currentProduct);
        };
    }
}

// Updated Universal Gallery (Slider everywhere)
function renderGallery() {
    if (!currentProduct) return;
    const galleryContainer = document.getElementById("productGallery");
    const firstClone = currentProduct.gallery[0];
    const lastClone = currentProduct.gallery[currentProduct.gallery.length - 1];
    const slides = [
        { src: lastClone, type: "clone-last" },
        ...currentProduct.gallery.map(src => ({ src, type: "real" })),
        { src: firstClone, type: "clone-first" }
    ];

    galleryContainer.innerHTML = `
        <div class="gallery-container" id="universalSlider" style="display: flex; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none;">
            ${slides.map(slide => `
                <img src="${slide.src}" class="gallery-image ${slide.type}" style="min-width: 100%; width: 100%; flex-shrink: 0; scroll-snap-align: center; object-fit: cover;">
            `).join("")}
        </div>
        
        <!-- Desktop Click Zones -->
        <div class="click-zone click-zone-left" onclick="scrollSlider(-1)"></div>
        <div class="click-zone click-zone-right" onclick="scrollSlider(1)"></div>
        
        <!-- Mobile Tap Zone (Transparent overlay for mobile only if needed, or stick to simple scroll) -->
        <!-- For this request: "Navigasi gambar... berat. Ubah event listener agar cukup sekali klik (tap)." -->
        <!-- We will attach a click listener to the images directly in the JS below to handle "tap to next" logic if not using zones. -->
        <!-- However, let's make the entire gallery clickable for "Next" on mobile if strictly requested, OR just rely on the scroll snap which is already there, 
             BUT the user said "pindah gambar" (move image) is heavy (berat). 
             Often swipe is fine, but if they want tap: -->

        
        <div class="slider-dots" id="sliderDots" style="display: flex; justify-content: center; margin-top: 15px; gap: 8px;">
            ${currentProduct.gallery.map((_, i) => `
                <div class="dot" data-index="${i}" style="width: 8px; height: 8px; background: ${i === 0 ? "#fff" : "#333"}; border-radius: 50%; transition: all 0.3s; cursor:pointer;" onclick="scrollToSlide(${i})"></div>
            `).join("")}
        </div>
    `;


    // Initialize Slider Interactions (Infinite Scroll Logic)
    setTimeout(() => {
        const slider = document.getElementById("universalSlider");
        if (!slider) return;
        const slideWidth = slider.clientWidth;
        slider.scrollLeft = slideWidth;

        let isScrolling = false;
        slider.addEventListener("scroll", () => {
            if (isScrolling) return;
            const scrollLeft = slider.scrollLeft;
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            let currentIndex = Math.round(scrollLeft / slideWidth) - 1;
            if (currentIndex < 0) currentIndex = currentProduct.gallery.length - 1;
            if (currentIndex >= currentProduct.gallery.length) currentIndex = 0;

            document.querySelectorAll(".slider-dots .dot").forEach((dot, i) => {
                dot.style.background = i === currentIndex ? "#fff" : "#333";
            });

            // Infinite loop jump
            if (Math.abs(scrollLeft - maxScroll) <= 5) {
                isScrolling = true;
                slider.style.scrollSnapType = "none";
                slider.scrollLeft = slideWidth;
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        slider.style.scrollSnapType = "x mandatory";
                        isScrolling = false;
                    });
                });
            } else if (scrollLeft <= 0) {
                isScrolling = true;
                slider.style.scrollSnapType = "none";
                slider.scrollLeft = slider.scrollWidth - (2 * slideWidth);
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        slider.style.scrollSnapType = "x mandatory";
                        isScrolling = false;
                    });
                });
            }
        });
    }, 50);
}

// Helper to interact with dots
function scrollToSlide(index) {
    const slider = document.getElementById("universalSlider");
    if (!slider) return;
    const slideWidth = slider.clientWidth;
    slider.scrollTo({
        left: slideWidth * (index + 1),
        behavior: 'smooth'
    });
}

function scrollSlider(direction) {
    const slider = document.getElementById("universalSlider");
    if (!slider) return;
    const slideWidth = slider.clientWidth;
    slider.scrollBy({
        left: direction * slideWidth,
        behavior: 'smooth'
    });
}


function changeMainImage(element, src) {
}

function switchTab(tabName) {
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    if (event && event.currentTarget) event.currentTarget.classList.add("active");

    document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.remove("active"));
    const tabPanel = document.getElementById(`tab-${tabName}`);
    if (tabPanel) tabPanel.classList.add("active");

    currentTab = tabName;
}

function selectSize(btn, size) {
    document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    currentSelectedSize = size;
}

function validateAndAddToCart(product) {
    if (currentSelectedSize) {
        const variantId = product.variants ? product.variants[currentSelectedSize] : null;
        if (variantId) {
            addToCart(product.id, currentSelectedSize, variantId);
            return;
        }
        alert("SYSTEM ERROR: VARIANT ID NOT FOUND. CONTACT ADMIN.");
    } else {
        alert("SYSTEM ALERT: PLEASE SELECT A SIZE CONFIGURATION.");
    }
}

let resizeTimer;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (currentProduct && document.getElementById("product-detail").classList.contains("active")) {
            renderGallery();
        }
    }, 250);
});

document.addEventListener('localizationChanged', () => {
    if (currentProduct && document.getElementById("product-detail").classList.contains("active")) {
        renderProductInfo();
        setupAddToCartButton();
    }
});