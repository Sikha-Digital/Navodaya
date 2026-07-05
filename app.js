/**
 * Mobile Registration Form - Frontend Logic
 */

// IMPORTANT: Replace this placeholder with your deployed Google Apps Script Web App URL!
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwTzhBzJeHrK2srklXAwqRGlCYhpFxrC0SYZ9eb1MV82D86w46hsn4R7h0cd1B8S3s/exec';

// Dropdown Component Controller (scroll & select, no search filter)
class SearchableCombobox {
  constructor(comboboxId, inputId, listId) {
    this.combobox = document.getElementById(comboboxId);
    this.input = document.getElementById(inputId);
    this.list = document.getElementById(listId);
    this.toggleBtn = this.combobox.querySelector('.dropdown-toggle');
    this.items = [];

    this.isOpen = false;

    this.init();
  }

  init() {
    // Open dropdown when tapping/clicking the readonly input
    this.input.addEventListener('click', () => {
      this.isOpen ? this.close() : this.open();
    });

    // Toggle dropdown when clicking the toggle button
    this.toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.isOpen ? this.close() : this.open();
    });

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
      const selectHandler = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.selectItem(item);
      };
      item.addEventListener('mousedown', selectHandler);
      item.addEventListener('touchstart', selectHandler, { passive: false });
      item.addEventListener('click', selectHandler);
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

    // Scroll selected item into view within the list container (NOT the page)
    const selected = this.list.querySelector('li.selected');
    if (selected) {
      // Use a small timeout to let the CSS transition open first
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
    this.input.dispatchEvent(new Event('input'));
  }

  reset() {
    this.items.forEach(i => i.classList.remove('selected'));
  }
}

// DOM Elements
const form = document.getElementById('registrationForm');
const nameInput = document.getElementById('nameInput');
const phoneInput = document.getElementById('phoneInput');
const areaInput = document.getElementById('areaInput');
const unitInput = document.getElementById('unitInput');

const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const spinner = submitBtn.querySelector('.spinner');

const formPanel = document.getElementById('formPanel');
const successPanel = document.getElementById('successPanel');
const resetBtn = document.getElementById('resetBtn');

const generalError = document.getElementById('generalError');
const errorMessage = document.getElementById('errorMessage');

// Initialize searchable dropdown components
const areaCombobox = new SearchableCombobox('areaCombobox', 'areaInput', 'areaList');
const unitCombobox = new SearchableCombobox('unitCombobox', 'unitInput', 'unitList');

// Area to Unit mapping object
const AREA_UNITS = {
  "Dammam Town": [
    "Center",
    "Al Dawazir",
    "Adama",
    "Kanoo",
    "Ladies Market",
    "Amamrah",
    "Madinath al umal",
    "Abdullah Faud",
    "AC Member"
  ],
  "Toyota": [
    "Khaleej 1",
    "Khaleej 2",
    "City",
    "Mubarakiya",
    "Nakkeel",
    "Anood",
    "Badiya",
    "Jalawiya",
    "Toyota",
    "AC Member"
  ],
  "Della": [
    "Bandhariya",
    "Kodariya North",
    "Kodariya South",
    "Della",
    "Della Sanayya East",
    "Della Sanayya West",
    "AC Member"
  ],
  "Faisaliya": [
    "Ninety One",
    "Faisaliya",
    "Souq Khanam",
    "Thirty Seven",
    "AC Member"
  ],
  "Sihath": [
    "Sihat Town",
    "Sihat North",
    "Anak",
    "Ummul Hammam",
    "Nabiya",
    "Al Aujam",
    "AC Member"
  ],
  "Qatif": [
    "Tharoth",
    "Thurqiya",
    "North",
    "Post Office",
    "Jaroodiya",
    "Market",
    "Majidiya",
    "South",
    "Mahadood",
    "AC Member"
  ],
  "Regional Committee": [
    "RC Member"
  ],
  "Dammam Family": [
    "Dammam Town",
    "Jalawiya",
    "Gazaz",
    "Badiya",
    "Della",
    "Qatif"
  ]
};

// Bind Area changes to dynamically update Unit dropdown options
areaInput.addEventListener('input', () => {
  const selectedArea = areaInput.value.trim();
  const matchingUnits = AREA_UNITS[selectedArea];
  
  if (matchingUnits) {
    unitCombobox.updateOptions(matchingUnits);
    unitInput.placeholder = " ";
  } else {
    // Clear Unit selection if Area is empty or invalid
    unitCombobox.updateOptions([]);
    unitInput.value = '';
    unitInput.dispatchEvent(new Event('input'));
  }
});

// Enforce exactly 9 digits for phone numbers (prefix +966 will be prepended on submit)
const PHONE_REGEX = /^[0-9]{9}$/;

/**
 * Validates a single input field
 */
function validateInput(input, errorElement, validationFn, defaultMsg) {
  const value = input.value.trim();
  let isValid = true;
  let customMessage = defaultMsg;

  if (input.required && !value) {
    isValid = false;
    customMessage = `${input.previousElementSibling ? '' : 'This field'} is required.`;
  } else if (validationFn && !validationFn(value)) {
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

// Attach event listeners for real-time validation on blur/input
nameInput.addEventListener('blur', () => validateInput(nameInput, document.getElementById('nameError'), null, 'Name is required.'));
nameInput.addEventListener('input', () => nameInput.classList.contains('touched') && validateInput(nameInput, document.getElementById('nameError'), null, 'Name is required.'));

phoneInput.addEventListener('blur', () => validateInput(phoneInput, document.getElementById('phoneError'), (val) => PHONE_REGEX.test(val), 'Please enter exactly 9 digits.'));
phoneInput.addEventListener('input', () => {
  // Enforce numbers only (strip any non-numeric input)
  phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
  if (phoneInput.classList.contains('touched')) {
    validateInput(phoneInput, document.getElementById('phoneError'), (val) => PHONE_REGEX.test(val), 'Please enter exactly 9 digits.');
  }
});

areaInput.addEventListener('blur', () => validateInput(areaInput, document.getElementById('areaError'), null, 'Select Area is required.'));
areaInput.addEventListener('input', () => areaInput.classList.contains('touched') && validateInput(areaInput, document.getElementById('areaError'), null, 'Select Area is required.'));

unitInput.addEventListener('blur', () => validateInput(unitInput, document.getElementById('unitError'), null, 'Select Unit is required.'));
unitInput.addEventListener('input', () => unitInput.classList.contains('touched') && validateInput(unitInput, document.getElementById('unitError'), null, 'Select Unit is required.'));

/**
 * Handle form submission
 */
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Hide general error initially
  generalError.classList.add('hidden');

  // Trigger validation across all fields
  const isNameValid = validateInput(nameInput, document.getElementById('nameError'), null, 'Name is required.');
  const isPhoneValid = validateInput(phoneInput, document.getElementById('phoneError'), (val) => PHONE_REGEX.test(val), 'Please enter exactly 9 digits.');
  const isAreaValid = validateInput(areaInput, document.getElementById('areaError'), null, 'Select Area is required.');
  const isUnitValid = validateInput(unitInput, document.getElementById('unitError'), null, 'Select Unit is required.');

  // If any input is invalid, abort submit
  if (!isNameValid || !isPhoneValid || !isAreaValid || !isUnitValid) {
    // Add touched to all inputs so styling is updated
    [nameInput, phoneInput, areaInput, unitInput].forEach(inp => inp.classList.add('touched'));
    return;
  }

  // Visual feedback: disable form and show spinner
  setSubmittingState(true);

  // Prepare payload
  const payload = {
    name: nameInput.value.trim(),
    phone: '966' + phoneInput.value.trim(),
    area: areaInput.value.trim(),
    unit: unitInput.value.trim()
  };

  // Warning check if user did not update the URL
  if (SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
    showError("Configuration Required: Please replace SCRIPT_URL with your actual Google Apps Script Web App URL.");
    setSubmittingState(false);
    return;
  }

  try {
    // Use standard CORS request with redirect follow (Apps Script Web Apps redirect to Google CDN)
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Using text/plain avoids CORS preflight OPTIONS request trigger, which can sometimes fail or block on simple web pages.
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
    showError('Unable to connect. Please check your internet connection or Apps Script deployment configuration.');
  } finally {
    setSubmittingState(false);
  }
});

/**
 * Toggle button submitting states
 */
function setSubmittingState(isSubmitting) {
  submitBtn.disabled = isSubmitting;
  [nameInput, phoneInput, areaInput, unitInput].forEach(inp => inp.disabled = isSubmitting);
  
  if (isSubmitting) {
    btnText.textContent = 'Submitting...';
    spinner.classList.remove('hidden');
  } else {
    btnText.textContent = 'Submit Registration';
    spinner.classList.add('hidden');
  }
}

/**
 * Display the success panel with slide transitions
 */
function showSuccess() {
  formPanel.classList.remove('active');
  
  // Brief timeout to let the fade-out finish before fading in success
  setTimeout(() => {
    successPanel.classList.add('active');
  }, 300);
}

/**
 * Show a general error message
 */
function showError(msg) {
  errorMessage.textContent = msg;
  generalError.classList.remove('hidden');
  generalError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Reset form fields and panels to clean state
 */
resetBtn.addEventListener('click', () => {
  // Clear inputs
  form.reset();
  
  // Reset combobox selections
  areaCombobox.reset();
  unitCombobox.reset();
  
  // Remove touched styling classes
  [nameInput, phoneInput, areaInput, unitInput].forEach(inp => {
    inp.classList.remove('touched');
    inp.disabled = false;
  });

  // Switch panels
  successPanel.classList.remove('active');
  
  setTimeout(() => {
    formPanel.classList.add('active');
    generalError.classList.add('hidden');
  }, 300);
});

// Automatically focus Name input on load
window.addEventListener('DOMContentLoaded', () => {
  nameInput.focus();
});
