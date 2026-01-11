
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
    // We do NOT automatically show banner on load anymore.
    // Logic is moved to tryShowCookieConsent() called by navigation.

    // If already consented, run checks (e.g. Geo) silently if needed
    if (window.appState.consent) {
        if (!localStorage.getItem('razr_currency_set')) {
            await checkGeoLocation();
        }
    }

    applyLocalization();
}

// New Function: Try to show consent modal if requirements met
window.tryShowCookieConsent = function () {
    // Requirement: Show only if consent NOT given yet.
    if (!window.appState.consent) {
        const modalBackdrop = document.getElementById('cookie-modal-backdrop');
        if (modalBackdrop) {
            // Slight delay for animation effect after navigation
            setTimeout(() => {
                modalBackdrop.classList.add('visible');
            }, 1000); // 1s delay as requested (or just enough to settle)
        }
    }
};

async function acceptCookies() {
    window.appState.consent = true;
    localStorage.setItem('razr_consent', 'true');

    // Hide Modal
    const modalBackdrop = document.getElementById('cookie-modal-backdrop');
    if (modalBackdrop) {
        modalBackdrop.classList.remove('visible');
    }

    // Trigger Geo Location Logic & Currency Update IMMEDIATELY
    await checkGeoLocation();

    // Apply changes
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

function submitContactForm(event) {
    if (event) event.preventDefault();

    // Simulate sending
    const btn = document.querySelector('.btn-submit-contact');
    const originalText = btn.innerHTML;
    const form = document.getElementById('contactForm');

    btn.innerHTML = "[ TRANSMITTING... ]";
    btn.disabled = true;

    setTimeout(() => {
        // Hide form, show success
        form.style.display = 'none';
        document.getElementById('contact-success').style.display = 'block';

        // Use mailto as backup/actual transmission for static site
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const subject = document.getElementById('contact-subject').value;
        const message = document.getElementById('contact-message').value;

        // Construct detailed body
        const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
        window.location.href = `mailto:info@razrbilz.id?subject=[${subject.toUpperCase()}] ${name}&body=${body}`;

        // Reset after delay? keeping it as sent is better.
    }, 1500);
}
