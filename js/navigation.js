// History Management
let isNavigating = false;

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) {
        navigate(event.state.page, false);
    } else {
        navigate('archive', false);
    }
});

function navigate(sectionId, pushState = true) {
    if (isNavigating) return;
    document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
    if (!["size-guide", "shipping-policy", "return-policy", "terms", "privacy", "contact"].includes(sectionId)) {
        document.querySelectorAll(".command-btn").forEach(btn => btn.classList.remove("active"));
    }

    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add("active");
        currentPage = sectionId;
        window.scrollTo(0, 0);

        // Highlight Active Button
        if (["archive", "about", "cart"].includes(sectionId)) {
            const btn = Array.from(document.querySelectorAll(".command-btn"))
                .find(b => b.textContent && b.textContent.includes(sectionId.toUpperCase().substring(0, 3)));
            if (btn) btn.classList.add("active");
        }
    }

    // Specific Page Logic
    if (sectionId === "archive") {
        renderProducts();
        if (window.tryShowCookieConsent) {
            window.tryShowCookieConsent();
        }
    } else if (sectionId === "about") {
        typewriterEffect();
    } else if (sectionId === "cart") {
        renderCart();
    } else if (sectionId === "contact") {
        const form = document.getElementById("contactForm");
        const msg = document.getElementById("contact-success");
        if (form && msg) {
            form.style.display = "block";
            form.reset();
            msg.style.display = "none";
        }
    }

    // Command Bar Visibility
    const cmdBar = document.querySelector(".command-bar");
    if (cmdBar) {
        if (sectionId === "checkout") {
            cmdBar.style.display = "none";
        } else {
            cmdBar.style.display = "flex";
        }
    }

    // History Push
    if (pushState) {
        const url = `#${sectionId}`;
        history.pushState({ page: sectionId }, "", url);
    }
}

// Initial History State Replacement on Load
document.addEventListener('DOMContentLoaded', () => {
    const initialPage = 'archive';
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        navigate(hash, false);
        history.replaceState({ page: hash }, "", `#${hash}`);
    } else {
        history.replaceState({ page: initialPage }, "", `#${initialPage}`);
    }
});
