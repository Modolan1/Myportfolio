// XSS Prevention Functions
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validateText(text, maxLength = 1000) {
    if (!text || text.trim().length === 0) {
        return false;
    }
    if (text.length > maxLength) {
        return false;
    }
    // Check for script tags and other dangerous patterns
    const dangerousPatterns = /<script|javascript:|onerror=|onload=/gi;
    return !dangerousPatterns.test(text);
}

// Tab functionality
var tabLinks = document.getElementsByClassName('tab-links');
var tabContents = document.getElementsByClassName('tab-contents');

function openTab(tabName) {
    for (let tablink of tabLinks) {
        tablink.classList.remove('active-link');
    }
    for (let tabContent of tabContents) {
        tabContent.classList.remove('active-tab');
    }
    event.currentTarget.classList.add('active-link');
    document.getElementById(tabName).classList.add('active-tab');
}

// Menu functions
var sidemenu = document.getElementById('sidemenu');

function openmenu() {
    sidemenu.style.right = '0';
}

function closemenu() {
    sidemenu.style.right = '-200px';
}

// Form validation and submission with XSS protection
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = form.querySelector('input[name="Name"]');
            const emailInput = form.querySelector('input[name="Email"]');
            const messageInput = form.querySelector('textarea[name="Message"]');
            
            // Sanitize inputs
            const name = sanitizeInput(nameInput.value.trim());
            const email = sanitizeInput(emailInput.value.trim());
            const message = sanitizeInput(messageInput.value.trim());
            
            // Validate inputs
            if (!validateText(name, 100)) {
                alert('Please enter a valid name (max 100 characters, no scripts)');
                return;
            }
            
            if (!validateEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            if (!validateText(message, 1000)) {
                alert('Please enter a valid message (max 1000 characters, no scripts)');
                return;
            }
            
            // Create sanitized form data
            const formData = new FormData();
            formData.append('Name', name);
            formData.append('Email', email);
            formData.append('Message', message);
            
            // Submit form (if action is set)
            if (this.action) {
                fetch(this.action, {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.text())
                .then(data => {
                    alert('Message sent successfully!');
                    form.reset();
                })
                .catch(error => {
                    alert('Error sending message. Please try again.');
                    console.error('Error:', error);
                });
            } else {
                alert('Form submitted successfully!\n\nName: ' + name + '\nEmail: ' + email);
                form.reset();
            }
        });
        
        // Real-time validation feedback
        const nameInput = form.querySelector('input[name="Name"]');
        const emailInput = form.querySelector('input[name="Email"]');
        const messageInput = form.querySelector('textarea[name="Message"]');
        
        if (nameInput) {
            nameInput.addEventListener('input', function() {
                if (!validateText(this.value, 100)) {
                    this.setCustomValidity('Invalid name');
                } else {
                    this.setCustomValidity('');
                }
            });
        }
        
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                if (!validateEmail(this.value)) {
                    this.setCustomValidity('Invalid email');
                } else {
                    this.setCustomValidity('');
                }
            });
        }
        
        if (messageInput) {
            messageInput.addEventListener('input', function() {
                if (!validateText(this.value, 1000)) {
                    this.setCustomValidity('Invalid message');
                } else {
                    this.setCustomValidity('');
                }
            });
        }
    }
});
