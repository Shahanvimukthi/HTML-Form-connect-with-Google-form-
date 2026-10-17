// PASTE your Apps Script Web App URL (ends with /exec)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzYRot8n-USfsLX5339MoO-52_EE-oaM4qZ7_fmPDyrl_zKbkroNhIXYQG962STFb0b/exec';

const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const statusEl = document.getElementById('formStatus');

function setError(name, message) {
    const el = form.querySelector(`.error[data-for="${name}"]`);
    if (el) el.textContent = message || '';
    const input = form.elements[name];
    if (input && input.classList) input.classList.toggle('invalid', Boolean(message));
}

function clearErrors() {
    form.querySelectorAll('.error').forEach((e) => (e.textContent = ''));
    form.querySelectorAll('.invalid').forEach((e) => e.classList.remove('invalid'));
}

function validate() {
    clearErrors();
    let ok = true;

    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const method = form.contactMethod.value;

    if (!firstName) { setError('firstName', 'First name is required.'); ok = false; }
    if (!lastName) { setError('lastName', 'Last name is required.'); ok = false; }

    if (!email) { setError('email', 'Email is required.'); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('email', 'Enter a valid email.'); ok = false; }

    if (phone && !/^[0-9+\-\s()]{7,20}$/.test(phone)) { setError('phone', 'Enter a valid phone number.'); ok = false; }

    if (!method) { setError('contactMethod', 'Please choose a contact method.'); ok = false; }
    if (method === 'Phone' && !phone) { setError('phone', 'Phone number is needed for phone contact.'); ok = false; }

    return ok;
}

function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = type || '';
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showStatus('', '');
    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'SENDING...';

    const data = new URLSearchParams({
        firstName: form.firstName.value.trim(),
        lastName: form.lastName.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        contactMethod: form.contactMethod.value,
        inquiry: form.inquiry.value.trim()
    });

    try {
        const res = await fetch(SCRIPT_URL, { method: 'POST', body: data });
        const json = await res.json();

        if (json.result === 'success') {
            showStatus('Thank you! We will get in touch soon.', 'ok');
            form.reset();
        } else {
            showStatus(json.message || 'Submission failed. Please try again.', 'fail');
        }
    } catch (err) {
        console.error(err);
        showStatus('Network error. Please check your connection and try again.', 'fail');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'GET IN TOUCH';
    }
});