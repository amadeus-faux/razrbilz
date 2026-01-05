// ============================================
// POLICY PAGES
// ============================================

function closePolicy() {
    // Return to previous page or archive
    navigate('archive');
}

// Contact support function
function contactSupport() {
    navigate('contact');
}

// Submit contact form
async function submitContactForm(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('.btn-submit-contact');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '[ SENDING... ]';
    submitBtn.disabled = true;
    
    try {
        const formData = new FormData(event.target);
        const contactData = {
            name: sanitizeInput(formData.get('name')),
            email: sanitizeInput(formData.get('email')),
            subject: formData.get('subject'),
            message: sanitizeInput(formData.get('message'))
        };
        
        // Send to backend API
        const API_URL = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000' 
            : 'https://your-backend-domain.com';
        
        const response = await fetch(`${API_URL}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Hide form and show success message
            document.getElementById('contactForm').style.display = 'none';
            document.getElementById('contact-success').style.display = 'block';
            
            // Track event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'contact_form_submit', {
                    subject: contactData.subject
                });
            }
        } else {
            throw new Error(result.message || 'Failed to send message');
        }
        
    } catch (error) {
        console.error('Contact form error:', error);
        alert('Failed to send message. Please try again or contact us directly via email or Instagram.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}
