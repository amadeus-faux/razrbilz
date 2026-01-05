// ============================================
// LANGUAGE DICTIONARY & LOGIC
// ============================================

const translations = {
    en: {
        // Navigation
        nav_archive: "ARCHIVE",
        nav_log: "LOG",
        nav_cache: "CACHE",

        // Portal
        portal_enter: "[ TAP TO ENTER ]",

        // Archive
        archive_title: "STEEL SKINS : COLLECTIONS 001",

        // Product Detail
        btn_secure: "[ SECURE PIECE ]",
        tab_specs: "TECH SPECS",
        tab_size: "SIZE GUIDE",
        tab_ship: "SHIPPING",

        // About & Log
        about_title: "THE DRIFTER OBSERVES.<br>THE STRATEGIST ACTS.",
        about_text: "You choose to drift, but you do not move blind. In a world of noise, information is leverage. The public gets the echo. The Community gets the source.",
        why_connect: "WHY CONNECT?",
        uplink_title_1: "PRIORITY COORDINATES:",
        uplink_desc_1: "You receive 24-Hour Early Access to every drop before the public panic begins.",
        uplink_title_2: "RAW SCHEMATICS:",
        uplink_desc_2: "Get direct transmission of our design blueprints, philosophy, and future architecture.",
        uplink_title_3: "ZERO NOISE PROTOCOL:",
        uplink_desc_3: "We do not send clutter. We transmit only signal.",
        btn_uplink: "[ INITIATE UPLINK ]",

        // Cart & Checkout
        cart_title: "CACHE",
        cart_empty: "YOUR CACHE IS EMPTY",
        checkout_title: "Ready to Secure?",
        checkout_desc: "Shipping & Taxes will be calculated at the next step via Shopify Secure Checkout.",
        btn_checkout: "PROCEED TO CHECKOUT",
        btn_return_cart: "< Return to cart",

        // Footer & Policies
        footer_refund: "REFUND POLICY",
        footer_terms: "TERMS OF SERVICE",
        footer_contact: "CONTACT US",
        footer_privacy: "PRIVACY POLICY",

        // Common
        loading: "[ LOADING... ]"
    },

    id: {
        // Navigation
        nav_archive: "ARSIP",
        nav_log: "JURNAL",
        nav_cache: "KERANJANG",

        // Portal
        portal_enter: "[ KETUK UNTUK MASUK ]",

        // Archive
        archive_title: "BAJA & KULIT : KOLEKSI 001",

        // Product Detail
        btn_secure: "[ AMANKAN BARANG ]",
        tab_specs: "SPESIFIKASI",
        tab_size: "PANDUAN UKURAN",
        tab_ship: "PENGIRIMAN",

        // About & Log
        about_title: "SANG PENGELANA MENGAMATI.<br>SANG STRATEGIS BERTINDAK.",
        about_text: "Anda memilih untuk hanyut, namun tidak buta arah. Di dunia yang penuh kebisingan, informasi adalah kekuatan. Publik hanya mendengar gema. Komunitas mendapatkan sumbernya.",
        why_connect: "MENGAPA BERGABUNG?",
        uplink_title_1: "KOORDINAT PRIORITAS:",
        uplink_desc_1: "Anda menerima Akses Awal 24 Jam ke setiap rilis sebelum kepanikan publik dimulai.",
        uplink_title_2: "SKEMA MENTAH:",
        uplink_desc_2: "Dapatkan transmisi langsung cetak biru desain, filosofi, dan arsitektur masa depan kami.",
        uplink_title_3: "PROTOKOL TANPA GANGGUAN:",
        uplink_desc_3: "Kami tidak mengirim sampah. Kami hanya mentransmisikan sinyal penting.",
        btn_uplink: "[ MULAI KONEKSI ]",

        // Cart & Checkout
        cart_title: "KERANJANG",
        cart_empty: "KERANJANG ANDA KOSONG",
        checkout_title: "Siap Mengamankan?",
        checkout_desc: "Pengiriman & Pajak akan dihitung pada langkah selanjutnya melalui Shopify Secure Checkout.",
        btn_checkout: "LANJUT KE PEMBAYARAN",
        btn_return_cart: "< Kembali ke keranjang",

        // Footer & Policies
        footer_refund: "KEBIJAKAN PENGEMBALIAN",
        footer_terms: "SYARAT LAYANAN",
        footer_contact: "HUBUNGI KAMI",
        footer_privacy: "KEBIJAKAN PRIVASI",

        // Common
        loading: "[ MEMUAT... ]"
    }
};

let currentLang = localStorage.getItem('razr_lang') || 'en';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('razr_lang', lang);
    updateContent();
    updateFlags();
}

function updateContent() {
    // 1. Update elemen dengan atribut data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            // Cek jika elemen adalah input/placeholder
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.placeholder = translations[lang][key];
            } else {
                element.innerHTML = translations[lang][key];
            }
        }
    });

    // 2. Update text content dinamis lainnya (bila perlu)
    document.documentElement.lang = lang;
}

function updateFlags() {
    const btns = document.querySelectorAll('.lang-btn');
    btns.forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
            btn.style.opacity = '1';
            btn.style.filter = 'grayscale(0%)';
        } else {
            btn.classList.remove('active');
            btn.style.opacity = '0.4';
            btn.style.filter = 'grayscale(100%)';
        }
    });
}

// Jalankan saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
});