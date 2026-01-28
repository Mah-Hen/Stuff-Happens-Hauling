(function (){
    const form = document.getElementById('contact-form');
    if (!form) return;

    const topicElement = document.getElementById('topic');
    const subjectField = document.getElementById('subjectField');
    const replyToField = document.getElementById('replyToField');
    const emailElement = document.getElementById('email');
    const formStatusElement = document.getElementById('form-status');

    const topicToTag = (topic) => {
        if (topic=== "billing") return "[Billing]";
        if (topic === "quote") return "[Quote]";
        return "[General]";
    };

    const updateSubject = () => {
        const tag = topicToTag(topicElement.value);
        subjectField.value = `${tag} SSH Contact Form Submission`;
    }

    // Set initial subject and ubdate on topic change
    updateSubject();
    topicElement.addEventListener('change', updateSubject);

    // Set reply-to on submit
    form.addEventListener('submit', () => {
        replyToField.value = emailElement.value.trim();
        updateSubject();
        formStatusElement.textContent = "Submitting...";
    });

})();
