
function closePolicy() {
    navigate("archive");
}

function contactSupport() {
    navigate("contact");
}

async function submitContactForm(e) {
    e.preventDefault();
    const btn = e.target.querySelector(".btn-submit-contact");
    const originalText = btn.innerHTML; // Use innerHTML to preserve any potential formatting? No, textContent is fine.

    const lang = window.appState.lang;
    const sendingText = lang === 'id' ? "[ MENGIRIM... ]" : "[ SENDING... ]";

    btn.textContent = sendingText;
    btn.disabled = true;

    try {
        const formData = new FormData(e.target);

        const data = {
            name: sanitizeInput(formData.get("name")),
            email: sanitizeInput(formData.get("email")),
            subject: formData.get("subject"),
            message: sanitizeInput(formData.get("message"))
        };

        // Determine API URL (Mock logic preserved)
        // const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://your-backend-domain.com';

        /* 
           Simulate network request for demo purposes since backend might not exist.
           Remove this block and uncomment fetch if real backend exists.
        */
        const response = await new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => ({ success: true }) }), 1500));

        // Real fetch:
        // const response = await fetch(`${apiUrl}/api/contact`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Failed to send message");
        }

        // Success
        document.getElementById("contactForm").style.display = "none";
        document.getElementById("contact-success").style.display = "block";

        if (typeof gtag !== "undefined") {
            gtag("event", "contact_form_submit", {
                subject: data.subject
            });
        }

    } catch (error) {
        console.error("Contact form error:", error);

        const errorMsg = lang === 'id'
            ? "Gagal mengirim pesan. Silakan coba lagi atau hubungi kami langsung melalui email atau Instagram."
            : "Failed to send message. Please try again or contact us directly via email or Instagram.";

        alert(errorMsg);

        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}
