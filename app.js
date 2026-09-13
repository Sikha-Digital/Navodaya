/**
 * Navodaya Open 2026 - International Badminton Tournament Registration Frontend
 */

// IMPORTANT: Replace this placeholder with your deployed Google Apps Script Web App URL!
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwj9BachqS-O30uiqF8-x-KkFqzmjrpL9KGQbG6lokJl3n80X4jnr9QWSgnxPgRrD0U/exec';

// Dropdown Component Controller (scroll & select, no search filter)
class SearchableCombobox {
  constructor(comboboxId, inputId, listId) {
    this.combobox = document.getElementById(comboboxId);
    this.input = document.getElementById(inputId);
    this.list = document.getElementById(listId);
    this.toggleBtn = this.combobox ? this.combobox.querySelector('.dropdown-toggle') : null;
    this.items = [];

    this.isOpen = false;

    if (this.combobox && this.input && this.list) {
      this.init();
    }
  }

  init() {
    // Open dropdown when tapping/clicking the readonly input
    this.input.addEventListener('click', () => {
      this.isOpen ? this.close() : this.open();
    });

    // Toggle dropdown when clicking the toggle button
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.isOpen ? this.close() : this.open();
      });
    }

    // Initial setup of list item listeners
    this.setupItems();

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!this.combobox.contains(e.target)) {
        this.close();
      }
    });
  }

  setupItems() {
    this.items = Array.from(this.list.querySelectorAll('li'));
    this.items.forEach((item) => {
      let scrollTopAtStart = 0;

      // Snapshot the list scroll position — do NOT select yet
      item.addEventListener('touchstart', () => {
        scrollTopAtStart = this.list.scrollTop;
      }, { passive: true });

      // On release: if list didn't scroll (< 5px), it was a tap → select
      item.addEventListener('touchend', (e) => {
        const scrolled = Math.abs(this.list.scrollTop - scrollTopAtStart);
        if (scrolled < 5) {
          e.preventDefault();
          this.selectItem(item);
        }
      }, { passive: false });

      // Desktop: mouse click
      item.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.selectItem(item);
      });
    });
  }

  updateOptions(options) {
    this.list.innerHTML = '';
    options.forEach(opt => {
      const li = document.createElement('li');
      li.setAttribute('data-value', opt);
      li.textContent = opt;
      this.list.appendChild(li);
    });
    this.setupItems();
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.combobox.classList.add('open');

    // Scroll selected item into view within the list container
    const selected = this.list.querySelector('li.selected');
    if (selected) {
      setTimeout(() => {
        this.list.scrollTop = selected.offsetTop - this.list.clientHeight / 2 + selected.clientHeight / 2;
      }, 50);
    } else {
      this.list.scrollTop = 0;
    }
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.combobox.classList.remove('open');
    this.input.dispatchEvent(new Event('blur'));
  }

  selectItem(item) {
    const val = item.getAttribute('data-value');
    this.input.value = val;

    this.items.forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');

    this.close();
    this.input.dispatchEvent(new Event('input', { bubbles: true }));
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  reset() {
    this.items.forEach(i => i.classList.remove('selected'));
    this.input.value = '';
  }

  setValue(val) {
    const item = this.items.find(i => i.getAttribute('data-value') === val);
    if (item) {
      this.input.value = val;
      this.items.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      this.input.dispatchEvent(new Event('input', { bubbles: true }));
      this.input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}

// DOM Elements
const form = document.getElementById('registrationForm');
const nameInput = document.getElementById('nameInput');
const phoneInput = document.getElementById('phoneInput');
const emailInput = document.getElementById('emailInput');
const iqamaInput = document.getElementById('iqamaInput');
const genderInput = document.getElementById('genderInput');
const dobInput = document.getElementById('dobInput');
const clubInput = document.getElementById('clubInput');
const categoryInput = document.getElementById('categoryInput');
const flightInput = document.getElementById('flightInput');

const partnerSection = document.getElementById('partnerSection');
const partnerNameInput = document.getElementById('partnerNameInput');
const partnerPhoneInput = document.getElementById('partnerPhoneInput');
const partnerIqamaInput = document.getElementById('partnerIqamaInput');
const partnerGenderInput = document.getElementById('partnerGenderInput');
const partnerDobInput = document.getElementById('partnerDobInput');

const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const spinner = submitBtn.querySelector('.spinner');

const introPanel = document.getElementById('introPanel');
const enterPortalBtn = document.getElementById('enterPortalBtn');
const introProgressBar = document.getElementById('introProgressBar');
const formPanel = document.getElementById('formPanel');
const successPanel = document.getElementById('successPanel');
const resetBtn = document.getElementById('resetBtn');

const generalError = document.getElementById('generalError');
const errorMessage = document.getElementById('errorMessage');

let introProgressTimer = null;
let isIntroTransitioned = false;

function transitionToForm() {
  if (isIntroTransitioned) return;
  isIntroTransitioned = true;
  if (introProgressTimer) clearInterval(introProgressTimer);

  if (introPanel) {
    introPanel.style.opacity = '0';
    introPanel.style.transform = 'translateY(-20px)';
  }

  setTimeout(() => {
    if (introPanel) introPanel.classList.remove('active');
    if (formPanel) formPanel.classList.add('active');
    setTimeout(() => {
      if (nameInput) nameInput.focus();
    }, 150);
  }, 400);
}

if (enterPortalBtn) {
  enterPortalBtn.addEventListener('click', transitionToForm);
}

function startIntroProgress() {
  if (!introProgressBar) return;
  let step = 0;
  const interval = 25;
  const totalSteps = 2400 / interval;

  introProgressTimer = setInterval(() => {
    step++;
    const progress = (step / totalSteps) * 100;
    introProgressBar.style.width = `${Math.min(progress, 100)}%`;
    if (step >= totalSteps) {
      transitionToForm();
    }
  }, interval);
}

// Initialize combobox components
const genderCombobox = new SearchableCombobox('genderCombobox', 'genderInput', 'genderList');
const partnerGenderCombobox = new SearchableCombobox('partnerGenderCombobox', 'partnerGenderInput', 'partnerGenderList');
const categoryCombobox = new SearchableCombobox('categoryCombobox', 'categoryInput', 'categoryList');
const flightCombobox = new SearchableCombobox('flightCombobox', 'flightInput', 'flightList');

// Category selection change -> show/hide Doubles Partner card
categoryInput.addEventListener('input', checkDoublesCategory);
categoryInput.addEventListener('change', checkDoublesCategory);

function checkDoublesCategory() {
  const val = categoryInput.value.trim();
  const isDoubles = val.toLowerCase().includes('doubles') || val.toLowerCase().includes('kids') || val.length > 0;

  if (isDoubles) {
    partnerSection.classList.remove('hidden');
    partnerNameInput.setAttribute('required', 'required');
    partnerPhoneInput.setAttribute('required', 'required');
    partnerIqamaInput.setAttribute('required', 'required');
    partnerGenderInput.setAttribute('required', 'required');
    partnerDobInput.setAttribute('required', 'required');
  } else {
    partnerSection.classList.add('hidden');
    [partnerNameInput, partnerPhoneInput, partnerIqamaInput, partnerGenderInput, partnerDobInput].forEach(inp => {
      inp.removeAttribute('required');
      inp.value = '';
      inp.classList.remove('touched');
    });
    partnerGenderCombobox.reset();
    ['partnerNameError', 'partnerPhoneError', 'partnerIqamaError', 'partnerGenderError', 'partnerDobError'].forEach(errId => {
      const el = document.getElementById(errId);
      if (el) el.textContent = '';
    });
  }

  // Auto-select gender based on event category selection
  if (val === "Men's Doubles") {
    genderCombobox.setValue('Male');
    partnerGenderCombobox.setValue('Male');
  } else if (val === "Women's Doubles") {
    genderCombobox.setValue('Female');
    partnerGenderCombobox.setValue('Female');
  } else if (val === "Mixed Doubles") {
    genderCombobox.reset();
    partnerGenderCombobox.reset();
  }
}

// Regex Validations
const PHONE_REGEX = /^[0-9]{9,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IQAMA_REGEX = /^[0-9]{10}$/;

/**
 * Validates a single input field
 */
function validateInput(input, errorElement, validationFn, defaultMsg) {
  const value = input.value.trim();
  let isValid = true;
  let customMessage = defaultMsg;

  if (input.hasAttribute('required') && !value) {
    isValid = false;
    customMessage = defaultMsg || 'This field is required.';
  } else if (value && validationFn && !validationFn(value)) {
    isValid = false;
  }

  if (!isValid) {
    input.classList.add('touched');
    input.setCustomValidity(customMessage);
    if (errorElement) {
      errorElement.textContent = customMessage;
    }
  } else {
    input.setCustomValidity('');
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  return isValid;
}

// Event Listeners for Validation
nameInput.addEventListener('blur', () => validateInput(nameInput, document.getElementById('nameError'), null, 'Full Name is required.'));
nameInput.addEventListener('input', () => nameInput.classList.contains('touched') && validateInput(nameInput, document.getElementById('nameError'), null, 'Full Name is required.'));

phoneInput.addEventListener('blur', () => validateInput(phoneInput, document.getElementById('phoneError'), (val) => PHONE_REGEX.test(val), 'Please enter 9 digits.'));
phoneInput.addEventListener('input', () => {
  phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
  if (phoneInput.classList.contains('touched')) {
    validateInput(phoneInput, document.getElementById('phoneError'), (val) => PHONE_REGEX.test(val), 'Please enter 9 digits.');
  }
});

emailInput.addEventListener('blur', () => validateInput(emailInput, document.getElementById('emailError'), (val) => EMAIL_REGEX.test(val), 'Please enter a valid email address.'));
emailInput.addEventListener('input', () => emailInput.classList.contains('touched') && validateInput(emailInput, document.getElementById('emailError'), (val) => EMAIL_REGEX.test(val), 'Please enter a valid email address.'));

iqamaInput.addEventListener('blur', () => validateInput(iqamaInput, document.getElementById('iqamaError'), (val) => IQAMA_REGEX.test(val), 'Please enter a 10-digit Iqama / ID number.'));
iqamaInput.addEventListener('input', () => {
  iqamaInput.value = iqamaInput.value.replace(/[^0-9]/g, '');
  if (iqamaInput.classList.contains('touched')) {
    validateInput(iqamaInput, document.getElementById('iqamaError'), (val) => IQAMA_REGEX.test(val), 'Please enter a 10-digit Iqama / ID number.');
  }
});

genderInput.addEventListener('blur', () => validateInput(genderInput, document.getElementById('genderError'), null, 'Gender selection is required.'));
genderInput.addEventListener('change', () => validateInput(genderInput, document.getElementById('genderError'), null, 'Gender selection is required.'));

dobInput.addEventListener('blur', () => validateInput(dobInput, document.getElementById('dobError'), null, 'Date of Birth is required.'));
dobInput.addEventListener('change', () => validateInput(dobInput, document.getElementById('dobError'), null, 'Date of Birth is required.'));

clubInput.addEventListener('blur', () => validateInput(clubInput, document.getElementById('clubError'), null, 'Country or Club Name is required.'));
clubInput.addEventListener('input', () => clubInput.classList.contains('touched') && validateInput(clubInput, document.getElementById('clubError'), null, 'Country or Club Name is required.'));

categoryInput.addEventListener('blur', () => validateInput(categoryInput, document.getElementById('categoryError'), null, 'Event category selection is required.'));
categoryInput.addEventListener('input', () => categoryInput.classList.contains('touched') && validateInput(categoryInput, document.getElementById('categoryError'), null, 'Event category selection is required.'));

flightInput.addEventListener('blur', () => validateInput(flightInput, document.getElementById('flightError'), null, 'Level selection is required.'));
flightInput.addEventListener('input', () => flightInput.classList.contains('touched') && validateInput(flightInput, document.getElementById('flightError'), null, 'Level selection is required.'));

partnerNameInput.addEventListener('blur', () => {
  if (!partnerSection.classList.contains('hidden')) {
    validateInput(partnerNameInput, document.getElementById('partnerNameError'), null, 'Partner Name is required for Doubles.');
  }
});

partnerPhoneInput.addEventListener('blur', () => {
  if (!partnerSection.classList.contains('hidden')) {
    validateInput(partnerPhoneInput, document.getElementById('partnerPhoneError'), null, 'Partner Contact Number is required.');
  }
});

partnerIqamaInput.addEventListener('blur', () => {
  if (!partnerSection.classList.contains('hidden')) {
    validateInput(partnerIqamaInput, document.getElementById('partnerIqamaError'), (val) => IQAMA_REGEX.test(val), 'Please enter partner 10-digit Iqama / ID number.');
  }
});
partnerIqamaInput.addEventListener('input', () => {
  partnerIqamaInput.value = partnerIqamaInput.value.replace(/[^0-9]/g, '');
  if (!partnerSection.classList.contains('hidden') && partnerIqamaInput.classList.contains('touched')) {
    validateInput(partnerIqamaInput, document.getElementById('partnerIqamaError'), (val) => IQAMA_REGEX.test(val), 'Please enter partner 10-digit Iqama / ID number.');
  }
});

partnerGenderInput.addEventListener('blur', () => {
  if (!partnerSection.classList.contains('hidden')) {
    validateInput(partnerGenderInput, document.getElementById('partnerGenderError'), null, 'Partner Gender selection is required.');
  }
});
partnerGenderInput.addEventListener('change', () => {
  if (!partnerSection.classList.contains('hidden')) {
    validateInput(partnerGenderInput, document.getElementById('partnerGenderError'), null, 'Partner Gender selection is required.');
  }
});

partnerDobInput.addEventListener('blur', () => {
  if (!partnerSection.classList.contains('hidden')) {
    validateInput(partnerDobInput, document.getElementById('partnerDobError'), null, 'Partner Date of Birth is required.');
  }
});
partnerDobInput.addEventListener('change', () => {
  if (!partnerSection.classList.contains('hidden')) {
    validateInput(partnerDobInput, document.getElementById('partnerDobError'), null, 'Partner Date of Birth is required.');
  }
});

/**
 * Handle form submission
 */
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  generalError.classList.add('hidden');

  const isNameValid = validateInput(nameInput, document.getElementById('nameError'), null, 'Full Name is required.');
  const isPhoneValid = validateInput(phoneInput, document.getElementById('phoneError'), (val) => PHONE_REGEX.test(val), 'Please enter 9 digits.');
  const isEmailValid = validateInput(emailInput, document.getElementById('emailError'), (val) => EMAIL_REGEX.test(val), 'Please enter a valid email address.');
  const isIqamaValid = validateInput(iqamaInput, document.getElementById('iqamaError'), (val) => IQAMA_REGEX.test(val), 'Please enter a 10-digit Iqama / ID number.');
  const isGenderValid = validateInput(genderInput, document.getElementById('genderError'), null, 'Gender selection is required.');
  const isDobValid = validateInput(dobInput, document.getElementById('dobError'), null, 'Date of Birth is required.');
  const isClubValid = validateInput(clubInput, document.getElementById('clubError'), null, 'Country or Club Name is required.');
  const isCategoryValid = validateInput(categoryInput, document.getElementById('categoryError'), null, 'Event category selection is required.');
  const isFlightValid = validateInput(flightInput, document.getElementById('flightError'), null, 'Level selection is required.');

  let isPartnerValid = true;
  if (!partnerSection.classList.contains('hidden')) {
    const isPNameValid = validateInput(partnerNameInput, document.getElementById('partnerNameError'), null, 'Partner Name is required for Doubles.');
    const isPPhoneValid = validateInput(partnerPhoneInput, document.getElementById('partnerPhoneError'), null, 'Partner Contact Number is required.');
    const isPIqamaValid = validateInput(partnerIqamaInput, document.getElementById('partnerIqamaError'), (val) => IQAMA_REGEX.test(val), 'Please enter partner 10-digit Iqama / ID number.');
    const isPGenderValid = validateInput(partnerGenderInput, document.getElementById('partnerGenderError'), null, 'Partner Gender selection is required.');
    const isPDobValid = validateInput(partnerDobInput, document.getElementById('partnerDobError'), null, 'Partner Date of Birth is required.');
    isPartnerValid = isPNameValid && isPPhoneValid && isPIqamaValid && isPGenderValid && isPDobValid;
  }

  if (!isNameValid || !isPhoneValid || !isEmailValid || !isIqamaValid || !isGenderValid || !isDobValid || !isClubValid || !isCategoryValid || !isFlightValid || !isPartnerValid) {
    [nameInput, phoneInput, emailInput, iqamaInput, genderInput, dobInput, clubInput, categoryInput, flightInput].forEach(inp => inp.classList.add('touched'));
    if (!partnerSection.classList.contains('hidden')) {
      [partnerNameInput, partnerPhoneInput, partnerIqamaInput, partnerGenderInput, partnerDobInput].forEach(inp => inp.classList.add('touched'));
    }
    return;
  }

  setSubmittingState(true);

  const payload = {
    name: nameInput.value.trim(),
    phone: '966' + phoneInput.value.trim(),
    email: emailInput.value.trim(),
    iqama: iqamaInput.value.trim(),
    gender: genderInput.value.trim(),
    dob: dobInput.value.trim(),
    club: clubInput.value.trim(),
    category: categoryInput.value.trim(),
    flight: flightInput.value.trim(),
    partnerName: partnerSection.classList.contains('hidden') ? '' : partnerNameInput.value.trim(),
    partnerPhone: partnerSection.classList.contains('hidden') ? '' : partnerPhoneInput.value.trim(),
    partnerIqama: partnerSection.classList.contains('hidden') ? '' : partnerIqamaInput.value.trim(),
    partnerGender: partnerSection.classList.contains('hidden') ? '' : partnerGenderInput.value.trim(),
    partnerDob: partnerSection.classList.contains('hidden') ? '' : partnerDobInput.value.trim()
  };

  if (!SCRIPT_URL || SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL')) {
    showError("Configuration Required: Please set SCRIPT_URL with your Google Apps Script Web App URL.");
    setSubmittingState(false);
    return;
  }

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result && result.status === 'success') {
      showSuccess();
    } else {
      showError(result.message || 'Server returned an error. Please try again.');
    }
  } catch (error) {
    console.error('Submission failed:', error);
    showError(error.message || 'Unable to connect. Please verify internet connection and Apps Script deployment settings.');
  } finally {
    setSubmittingState(false);
  }
});

function setSubmittingState(isSubmitting) {
  submitBtn.disabled = isSubmitting;
  [nameInput, phoneInput, emailInput, iqamaInput, genderInput, dobInput, clubInput, categoryInput, flightInput, partnerNameInput, partnerPhoneInput, partnerIqamaInput, partnerGenderInput, partnerDobInput].forEach(inp => inp.disabled = isSubmitting);

  if (isSubmitting) {
    btnText.textContent = 'Submitting Entry...';
    spinner.classList.remove('hidden');
  } else {
    btnText.textContent = 'Submit Tournament Entry';
    spinner.classList.add('hidden');
  }
}

function showSuccess() {
  formPanel.classList.remove('active');
  setTimeout(() => {
    successPanel.classList.add('active');
  }, 300);
}

function showError(msg) {
  errorMessage.textContent = msg;
  generalError.classList.remove('hidden');
  generalError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

resetBtn.addEventListener('click', () => {
  form.reset();

  genderCombobox.reset();
  partnerGenderCombobox.reset();
  categoryCombobox.reset();
  flightCombobox.reset();

  partnerSection.classList.add('hidden');

  [nameInput, phoneInput, emailInput, iqamaInput, genderInput, dobInput, clubInput, categoryInput, flightInput, partnerNameInput, partnerPhoneInput, partnerIqamaInput, partnerGenderInput, partnerDobInput].forEach(inp => {
    inp.classList.remove('touched');
    inp.disabled = false;
  });

  successPanel.classList.remove('active');

  setTimeout(() => {
    formPanel.classList.add('active');
    generalError.classList.add('hidden');
  }, 300);
});

window.addEventListener('DOMContentLoaded', () => {
  startIntroProgress();
});

