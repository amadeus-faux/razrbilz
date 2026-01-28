// Application State
window.appState = {
    lang: localStorage.getItem('razr_lang') || 'en',
    currency: localStorage.getItem('razr_currency') || 'IDR',
    exchangeRate: 15500, // 1 USD = 15,500 IDR
    consent: localStorage.getItem('razr_consent') === 'true'
};

// Format Price based on current currency
function formatPrice(priceInIDR) {
    if (window.appState.currency === 'IDR') {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(priceInIDR);
    } else {
        const priceInUSD = priceInIDR / window.appState.exchangeRate;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(priceInUSD);
    }
}

// Sanitize Input
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// External Links
function openWhatsApp() {
    window.open("https://wa.me/6287763997856?text=Hi%20RAZRBILZ,%20I%20have%20a%20question%20about...", "_blank");
}

function openInstagram() {
    window.open("https://instagram.com/razrbilz", "_blank");
}

function sendEmail() {
    window.location.href = "mailto:razrbilz@gmail.com?subject=Inquiry%20from%20Website";
}

// Cookie Consent & Localization Initialization
async function initLocalization() {
    if (window.appState.consent) {
        if (!localStorage.getItem('razr_currency_set')) {
            await checkGeoLocation();
        }
    }
    applyLocalization();
}

// New Function: Try to show consent modal if requirements met
window.tryShowCookieConsent = function () {
    if (!window.appState.consent) {
        const modalBackdrop = document.getElementById('cookie-modal-backdrop');
        if (modalBackdrop) {
            setTimeout(() => {
                modalBackdrop.classList.add('visible');
            }, 1000);
        }
    }
};

async function acceptCookies() {
    window.appState.consent = true;
    localStorage.setItem('razr_consent', 'true');
    const modalBackdrop = document.getElementById('cookie-modal-backdrop');
    if (modalBackdrop) {
        modalBackdrop.classList.remove('visible');
    }
    await checkGeoLocation();
    applyLocalization();
}

async function checkGeoLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_code && data.country_code !== 'ID') {
            window.appState.currency = 'USD';
        } else {
            window.appState.currency = 'IDR';
        }
        localStorage.setItem('razr_currency_set', 'true');
    } catch (error) {
        console.log('Geo-location failed, keeping default (IDR).');
        window.appState.currency = 'IDR';
    }
}

function applyLocalization() {
    localStorage.setItem('razr_lang', window.appState.lang);
    localStorage.setItem('razr_currency', window.appState.currency);
    document.documentElement.lang = window.appState.lang;

    // Dispatch event
    const event = new CustomEvent('localizationChanged', {
        detail: {
            lang: window.appState.lang,
            currency: window.appState.currency
        }
    });
    document.dispatchEvent(event);
}

// Manual Language Switch
function setLanguage(lang) {
    window.appState.lang = lang;
    applyLocalization();
}

// Run init on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLocalization);
} else {
    initLocalization();
}

function submitContactForm(event) {
    if (event) event.preventDefault();
    const btn = document.querySelector('.btn-submit-contact');
    const originalText = btn.innerHTML;
    const form = document.getElementById('contactForm');
    btn.innerHTML = "[ TRANSMITTING... ]";
    btn.disabled = true;
    setTimeout(() => {
        form.style.display = 'none';
        document.getElementById('contact-success').style.display = 'block';
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const subject = document.getElementById('contact-subject').value;
        const message = document.getElementById('contact-message').value;
        const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
        window.location.href = `mailto:razrbilz@gmail.com?subject=[${subject.toUpperCase()}] ${name}&body=${body}`;

    }, 1500);
}
