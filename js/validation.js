// ============================================
// FORM VALIDATION
// ============================================

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation (Indonesian format)
function isValidPhone(phone) {
    // Remove all non-numeric characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if starts with 08 or +62 and has 10-13 digits
    return /^(08|628|\+628)\d{8,11}$/.test(cleanPhone);
}

// Postal code validation (Indonesian format)
function isValidPostalCode(code) {
    return /^\d{5}$/.test(code);
}

// Real-time form validation
function setupFormValidation() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;
    
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const postalCodeInput = document.getElementById('postalCode');
    
    // Email validation
    emailInput.addEventListener('blur', function() {
        if (!isValidEmail(this.value)) {
            showFieldError(this, 'Please enter a valid email address');
        } else {
            clearFieldError(this);
        }
    });
    
    // Phone validation
    phoneInput.addEventListener('blur', function() {
        if (!isValidPhone(this.value)) {
            showFieldError(this, 'Please enter a valid Indonesian phone number');
        } else {
            clearFieldError(this);
        }
    });
    
    // Postal code validation
    if (postalCodeInput) {
        postalCodeInput.addEventListener('blur', function() {
            if (!isValidPostalCode(this.value)) {
                showFieldError(this, 'Please enter a valid 5-digit postal code');
            } else {
                clearFieldError(this);
            }
        });
    }
    
    // Format phone number on input
    phoneInput.addEventListener('input', function() {
        // Only allow numbers and +
        this.value = this.value.replace(/[^\d+]/g, '');
    });
    
    // Format postal code on input
    if (postalCodeInput) {
        postalCodeInput.addEventListener('input', function() {
            // Only allow numbers, max 5 digits
            this.value = this.value.replace(/\D/g, '').substring(0, 5);
        });
    }
}

function showFieldError(field, message) {
    // Remove existing error
    clearFieldError(field);
    
    // Add error class
    field.style.borderColor = 'var(--alert-red)';
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--alert-red)';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '5px';
    
    field.parentElement.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const errorDiv = field.parentElement.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Validate entire form before submission
function validateCheckoutForm(formData) {
    const errors = [];
    
    const email = formData.get('email');
    const phone = formData.get('phone');
    const postalCode = formData.get('postalCode');
    
    if (!isValidEmail(email)) {
        errors.push('Invalid email address');
    }
    
    if (!isValidPhone(phone)) {
        errors.push('Invalid phone number');
    }
    
    if (postalCode && !isValidPostalCode(postalCode)) {
        errors.push('Invalid postal code');
    }
    
    if (!formData.get('fullname').trim()) {
        errors.push('Name is required');
    }
    
    if (!formData.get('address').trim()) {
        errors.push('Address is required');
    }
    
    if (!formData.get('city').trim()) {
        errors.push('City is required');
    }
    
    if (!formData.get('shipping')) {
        errors.push('Please select a shipping method');
    }
    
    return errors;
}
