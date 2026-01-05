// ============================================
// UTILITY FUNCTIONS
// ============================================
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

function formatPrice(price) {
    return price.toLocaleString('id-ID');
}

function openWhatsApp() {
    window.open('https://wa.me/6281234567890?text=Hi%20RAZRBILZ,%20I%20have%20a%20question%20about...', '_blank');
}

function openInstagram() {
    window.open('https://instagram.com/razrbilz', '_blank');
}

function sendEmail() {
    window.location.href = 'mailto:support@razrbilz.com?subject=Inquiry%20from%20Website';
}
