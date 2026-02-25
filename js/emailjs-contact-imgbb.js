// EmailJS Contact Form Handler with Image Upload to ImgBB
// ===========================================================
// This version uploads images to ImgBB (free) and sends links
// instead of attachments, bypassing EmailJS's 50KB limit
// ===========================================================

(function() {
    // ====== REPLACE THESE VALUES ======
    const EMAIL_CONFIG = {
        publicKey: 'S8iSwVtON7eL7bLtg',        // From EmailJS Dashboard
        serviceID: 'contact_service',        // From EmailJS Dashboard
        templateID: 'template_9sui7av'       // From EmailJS Dashboard
    };
    
    // Sign up, get API key, paste here
    const IMGBB_API_KEY = 'bdd438d36a769f1cbe997ead57064854';
    // ==================================

    // Initialize EmailJS
    emailjs.init(EMAIL_CONFIG.publicKey);

    const form = document.getElementById('contact-form');
    const statusElement = document.getElementById('form-status');
    const submitButton = form.querySelector('button[type="submit"]');

    // Helper function to show status messages
    function showStatus(message, type = 'info') {
        statusElement.textContent = message;
        statusElement.style.color = type === 'error' ? '#ef4444' : 
                                     type === 'success' ? '#10b981' : '#8a8f98';
    }

    // Upload image to ImgBB
    async function uploadToImgBB(file) {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Image upload failed');
        }
        
        const data = await response.json();
        return data.data.url; // Returns direct image URL
    }

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Disable submit button
        submitButton.disabled = true;
        showStatus('Sending your message...', 'info');

        try {
            // Get form data
            const templateParams = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value || 'Not provided',
                topic: document.getElementById('topic').value,
                message: document.getElementById('message').value
            };

            // Format the topic for the subject line
            const topicLabels = {
                'quote': '[Quote Request]',
                'general': '[General Inquiry]',
                'billing': '[Billing]'
            };
            templateParams.subject = `${topicLabels[templateParams.topic]} - Contact from ${templateParams.name}`;

            // Handle file uploads
            const photoInput = document.getElementById('photos');
            const files = Array.from(photoInput.files);
            
            if (files.length > 0) {
                showStatus('Uploading images...', 'info');
                
                // Limit to 5 files
                const limitedFiles = files.slice(0, 5);
                
                if (files.length > 5) {
                    showStatus('Only first 5 images will be uploaded...', 'info');
                }
                
                // Upload all images to ImgBB
                const uploadPromises = limitedFiles.map(file => uploadToImgBB(file));
                const imageUrls = await Promise.all(uploadPromises);
                
                // Create formatted list of image links for email
                const imageLinksHtml = imageUrls.map((url, index) => 
                    `Image ${index + 1}: ${url}`
                ).join('\n');
                
                templateParams.image_links = imageLinksHtml;
                templateParams.image_count = imageUrls.length;
            } else {
                templateParams.image_links = 'No images attached';
                templateParams.image_count = 0;
            }

            // Send email via EmailJS
            showStatus('Sending email...', 'info');
            const response = await emailjs.send(
                EMAIL_CONFIG.serviceID,
                EMAIL_CONFIG.templateID,
                templateParams
            );

            // Success!
            if (response.status === 200) {
                showStatus('✓ Message sent successfully! We\'ll get back to you soon.', 'success');
                form.reset();
                
                // Clear status after 5 seconds
                setTimeout(() => {
                    showStatus('');
                }, 5000);
            }

        } catch (error) {
            console.error('Error:', error);
            
            // Show error message
            if (error.message.includes('upload')) {
                showStatus('Image upload failed. Please try smaller images or email us directly.', 'error');
            } else if (error.text) {
                showStatus(`Error: ${error.text}. Please try again or email us directly.`, 'error');
            } else {
                showStatus('Failed to send message. Please try again or email us directly.', 'error');
            }
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
        }
    });

    // Clear status on input
    form.addEventListener('input', () => {
        if (statusElement.textContent && !statusElement.textContent.includes('sent successfully')) {
            showStatus('');
        }
    });
})();