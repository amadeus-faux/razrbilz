
// Application State
window.appState = {
    // Default setting: English Language but IDR Currency
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
        // Convert to USD
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
    window.open("https://wa.me/6281234567890?text=Hi%20RAZRBILZ,%20I%20have%20a%20question%20about...", "_blank");
}

function openInstagram() {
    window.open("https://instagram.com/razrbilz", "_blank");
}

function sendEmail() {
    window.location.href = "mailto:support@razrbilz.com?subject=Inquiry%20from%20Website";
}

// Cookie Consent & Localization Initialization
async function initLocalization() {
    // Check Consent
    const consentBanner = document.getElementById('cookie-banner');

    if (!window.appState.consent) {
        // Show Banner
        if (consentBanner) {
            consentBanner.style.display = 'block';
            setTimeout(() => consentBanner.classList.add('visible'), 100);
        }
    } else {
        // Already Consented, perform Geo Check if not already cached/set
        // Note: Logic says "If detection ... switch currency".
        // If we have stored currency preference, we respect it? 
        // Or do we re-check geo? Usually respect stored.
        if (!localStorage.getItem('razr_currency_set')) {
            await checkGeoLocation();
        }
    }

    // Check banner visibility if element missing (safety)
    if (!window.appState.consent && !consentBanner) {
        // Fallback or retry?
        console.warn("Cookie banner element missing");
    }

    applyLocalization();
}

async function acceptCookies() {
    window.appState.consent = true;
    localStorage.setItem('razr_consent', 'true');

    // Hide Banner
    const consentBanner = document.getElementById('cookie-banner');
    if (consentBanner) {
        consentBanner.classList.remove('visible');
        setTimeout(() => consentBanner.style.display = 'none', 500);
    }

    // Trigger Geo Location Logic
    await checkGeoLocation();
    applyLocalization();
}

async function checkGeoLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        // Logic: Outside Indonesia -> USD. Inside -> IDR.
        // Default is IDR. Only switch to USD if explicitly detected as NOT ID.

        if (data.country_code && data.country_code !== 'ID') {
            window.appState.currency = 'USD';
        } else {
            window.appState.currency = 'IDR';
        }

        // Mark as set
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
    // Note: Manual Language toggle does NOT enforce currency change based on valid user preferences usually.
    // But previous logic was strict. Does user want Lang switch to also switch currency?
    // "Default Settings... English... IDR".
    // "Persist... preference".
    // I will decouple customization. Switching Language changes Language.
    // Switching Currency (if we had a toggle) changes currency.
    // For now, if user clicks ID flag, maybe they expect IDR? 
    // "If in Indonesia, display IDR".
    // I'll stick to: Manual Lang switch toggles Currency for convenience (ID<->IDR, EN<->USD) 
    // UNLESS we want to allow EN+IDR (which is the default!).
    // The default is EN + IDR.
    // So if I switch to ID, I should probably go to IDR.
    // If I switch to EN, should I go to USD? 
    // No, because default is "English text but display prices in IDR".
    // So `setLanguage` should ONLY change Language?
    // Let's make `setLanguage` ONLY change language to support the EN+IDR case.

    applyLocalization();
}

// Run init on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLocalization);
} else {
    initLocalization();
}
