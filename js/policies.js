function closePolicy() {
    navigate("archive");
}

function contactSupport() {
    navigate("contact");
}

async function submitContactForm(e) {
    e.preventDefault();
    const btn = e.target.querySelector(".btn-submit-contact");
    const originalText = btn.innerHTML;

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

        const response = await fetch("https://formspree.io/f/xojvrojk", {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok) {
        } else {
            throw new Error(result.error || "Failed to send message");
        }

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
