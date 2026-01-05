function navigate(page) {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Update command bar (skip for policy and contact pages)
    if (!['size-guide', 'shipping-policy', 'return-policy', 'terms', 'privacy', 'contact'].includes(page)) {
        document.querySelectorAll('.command-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }
    
    // Show target section
    const targetSection = document.getElementById(page);
    if (targetSection) {
        targetSection.classList.add('active');
        currentPage = page;
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Update active button (only for main navigation)
        if (['archive', 'about', 'cart'].includes(page)) {
            const activeBtn = Array.from(document.querySelectorAll('.command-btn'))
                .find(btn => btn.textContent.includes(page.toUpperCase().substring(0, 3)));
            if (activeBtn) activeBtn.classList.add('active');
        }
    }
    
    // Special actions for specific pages
    if (page === 'archive') {
        renderProducts();
    } else if (page === 'about') {
        typewriterEffect();
    } else if (page === 'cart') {
        renderCart();
    } else if (page === 'contact') {
        // Reset contact form if returning to it
        const form = document.getElementById('contactForm');
        const successMsg = document.getElementById('contact-success');
        if (form && successMsg) {
            form.style.display = 'block';
            form.reset();
            successMsg.style.display = 'none';
        }
    }

    const commandBar = document.querySelector('.command-bar');
    if (commandBar) {
        if (page === 'checkout') {
            commandBar.style.display = 'none'; // Sembunyi
        } else {
            commandBar.style.display = 'flex'; // Muncul (gunakan 'flex' agar layout tetap rapi)
        }
    }
}

