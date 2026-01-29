(function (){
    const form = document.getElementById('contact-form');
    if (!form) return;

    const topicElement = document.getElementById('topic');
    const subjectField = document.getElementById('subjectField');
    // const replyToField = document.getElementById('replyToField');
    const emailElement = document.getElementById('email');
    const formStatusElement = document.getElementById('form-status');

    const topicToTag = (topic) => {
        if (topic=== "billing") return "[Billing]";
        if (topic === "quote") return "[Quote]";
        return "[General]";
    };

    const updateSubject = () => {
        // const tag = topicToTag(topicElement.value);
        subjectField.value = `${topicToTag(topicElement.value)} SSH Contact Form Submission`;
    }

    // Clear status message and enable submit button
    const clearStatus = () => {
        if (formStatusElement) formStatusElement.textContent = "";
        const btn = form.querySelectorAll('button[type="submit"]');
        if (btn) {
            btn.disabled = false;
        }
    }

    // Set initial subject and update on topic change
    updateSubject();
    topicElement.addEventListener('change', updateSubject);

    // Clear status on input
    form.addEventListener('input', clearStatus);

    // Clear status on page show (bfcache)
    window.addEventListener('pageshow', (event) => {
        if (event.persisted && formStatusElement) {
            clearStatus();
        }
    });

        // Set reply-to on submit
    form.addEventListener('submit', () => {
       // replyToField.value = emailElement.value.trim();
        updateSubject();
        if (formStatusElement) formStatusElement.textContent = "Submitting...";
        const btn = form.querySelectorAll('button[type="submit"]');
        if (btn) {
            btn.disabled = true;
        }
    });

})();
