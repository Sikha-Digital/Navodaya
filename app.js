/**
 * Navodaya Open 2026 - International Badminton Tournament Registration Frontend
 */

// IMPORTANT: Replace this placeholder with your deployed Google Apps Script Web App URL!
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwj9BachqS-O30uiqF8-x-KkFqzmjrpL9KGQbG6lokJl3n80X4jnr9QWSgnxPgRrD0U/exec';

// Dropdown Component Controller (scroll & select, no search filter)
class SearchableCombobox {
  constructor(comboboxId, inputId, listId) {
    this.comboboxId = comboboxId;
    this.inputId = inputId;
    this.listId = listId;
    this.isOpen = false;
    this.items = [];
    this.isInitialized = false;

    this.init();
  }

  get combobox() {
    return document.getElementById(this.comboboxId);
  }

  get input() {
    return document.getElementById(this.inputId);
  }

  get list() {
    return document.getElementById(this.listId);
  }

  get toggleBtn() {
    const el = this.combobox;
    return (el && typeof el.querySelector === 'function') ? el.querySelector('.dropdown-toggle') : null;
  }

  init() {
    if (this.isInitialized) return;
    const cEl = this.combobox;
    const iEl = this.input;
    const lEl = this.list;

    if (!cEl || !iEl || !lEl) return;

    this.isInitialized = true;

    iEl.addEventListener('click', () => {
      this.isOpen ? this.close() : this.open();
    });

    const btn = this.toggleBtn;
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.isOpen ? this.close() : this.open();
      });
    }

    this.setupItems();

    document.addEventListener('click', (e) => {
      const currentBox = this.combobox;
      if (currentBox && !currentBox.contains(e.target)) {
        this.close();
      }
    });
  }

  setupItems() {
    const lEl = this.list;
    if (!lEl) return;
    this.items = Array.from(lEl.querySelectorAll('li'));
    this.items.forEach((item) => {
      let scrollTopAtStart = 0;

      item.addEventListener('touchstart', () => {
        if (this.list) scrollTopAtStart = this.list.scrollTop;
      }, { passive: true });

      item.addEventListener('touchend', (e) => {
        const listEl = this.list;
        const scrolled = listEl ? Math.abs(listEl.scrollTop - scrollTopAtStart) : 0;
        if (scrolled < 5) {
          e.preventDefault();
          this.selectItem(item);
        }
      }, { passive: false });

      item.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.selectItem(item);
      });
    });
  }

  updateOptions(options) {
    const lEl = this.list;
    if (!lEl) return;
    lEl.innerHTML = '';
    options.forEach(opt => {
      const li = document.createElement('li');
      li.setAttribute('data-value', opt);
      li.textContent = opt;
      lEl.appendChild(li);
    });
    this.setupItems();
  }

  disable() {
    this.isDisabled = true;
    this.close();
    const cEl = this.combobox;
    if (cEl) cEl.classList.add('disabled-combobox');
    const btn = this.toggleBtn;
    if (btn) btn.style.display = 'none';
    if (this.input) this.input.setAttribute('tabindex', '-1');
  }

  enable() {
    this.isDisabled = false;
    const cEl = this.combobox;
    if (cEl) cEl.classList.remove('disabled-combobox');
    const btn = this.toggleBtn;
    if (btn) btn.style.display = '';
    if (this.input) this.input.removeAttribute('tabindex');
  }

  open() {
    if (this.isDisabled) return;
    const cEl = this.combobox;
    const lEl = this.list;
    if (this.isOpen || !cEl || !lEl) return;
    this.isOpen = true;
    cEl.classList.add('open');

    const selected = lEl.querySelector('li.selected');
    if (selected) {
      setTimeout(() => {
        if (this.list) {
          this.list.scrollTop = selected.offsetTop - this.list.clientHeight / 2 + selected.clientHeight / 2;
        }
      }, 50);
    } else {
      lEl.scrollTop = 0;
    }
  }

  close() {
    const cEl = this.combobox;
    const iEl = this.input;
    if (!this.isOpen || !cEl || !iEl) return;
    this.isOpen = false;
    cEl.classList.remove('open');
    iEl.dispatchEvent(new Event('blur'));
  }

  selectItem(item) {
    const iEl = this.input;
    if (!item || !iEl) return;
    const val = item.getAttribute('data-value');
    iEl.value = val;

    this.items.forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');

    this.close();
    iEl.dispatchEvent(new Event('input', { bubbles: true }));
    iEl.dispatchEvent(new Event('change', { bubbles: true }));
  }

  reset() {
    this.items.forEach(i => i.classList.remove('selected'));
    const iEl = this.input;
    if (iEl) iEl.value = '';
  }

  setValue(val) {
    const iEl = this.input;
    const item = this.items.find(i => i.getAttribute('data-value') === val);
    if (item && iEl) {
      iEl.value = val;
      this.items.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      iEl.dispatchEvent(new Event('input', { bubbles: true }));
      iEl.dispatchEvent(new Event('change', { bubbles: true }));
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
const nationalityInput = document.getElementById('nationalityInput');
const clubInput = document.getElementById('clubInput');
const categoryInput = document.getElementById('categoryInput');
const flightInput = document.getElementById('flightInput');

const partnerSection = document.getElementById('partnerSection');
const partnerNameInput = document.getElementById('partnerNameInput');
const partnerPhoneInput = document.getElementById('partnerPhoneInput');
const partnerIqamaInput = document.getElementById('partnerIqamaInput');
const partnerGenderInput = document.getElementById('partnerGenderInput');
const partnerDobInput = document.getElementById('partnerDobInput');
const partnerNationalityInput = document.getElementById('partnerNationalityInput');

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

// Step Navigation Elements
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const stepTab1 = document.getElementById('stepTab1');
const stepTab2 = document.getElementById('stepTab2');
const stepLine = document.getElementById('stepLine');
const nextStepBtn = document.getElementById('nextStepBtn');
const prevStepBtn = document.getElementById('prevStepBtn');

function validateStep1() {
  const isNameValid = validateInput(nameInput, document.getElementById('nameError'), null, 'Full Name is required.');
  const isPhoneValid = validateInput(phoneInput, document.getElementById('phoneError'), (val) => PHONE_REGEX.test(val), 'Please enter a valid phone number (7-15 digits).');
  const isEmailValid = validateInput(emailInput, document.getElementById('emailError'), (val) => EMAIL_REGEX.test(val), 'Please enter a valid email address.');
  const isIqamaValid = validateInput(iqamaInput, document.getElementById('iqamaError'), (val) => IQAMA_REGEX.test(val), 'Please enter a 10-digit Iqama / ID number.');
  const isGenderValid = validateInput(genderInput, document.getElementById('genderError'), null, 'Gender selection is required.');
  const isDobValid = validateInput(dobInput, document.getElementById('dobError'), null, 'Date of Birth is required.');
  const isNationalityValid = validateInput(nationalityInput, document.getElementById('nationalityError'), null, 'Nationality is required.');
  const isClubValid = validateInput(clubInput, document.getElementById('clubError'), null, 'Country or Club Name is required.');

  if (!isNameValid || !isPhoneValid || !isEmailValid || !isIqamaValid || !isGenderValid || !isDobValid || !isNationalityValid || !isClubValid) {
    [nameInput, phoneInput, emailInput, iqamaInput, genderInput, dobInput, nationalityInput, clubInput].forEach(inp => inp.classList.add('touched'));
    return false;
  }
  return true;
}

function goToStep(stepNum) {
  if (stepNum === 2) {
    if (!validateStep1()) return;
    step1.classList.remove('active');
    step2.classList.add('active');
    stepTab1.classList.remove('active');
    stepTab1.classList.add('completed');
    stepTab2.classList.add('active');
    stepLine.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    step2.classList.remove('active');
    step1.classList.add('active');
    stepTab2.classList.remove('active');
    stepTab1.classList.remove('completed');
    stepTab1.classList.add('active');
    stepLine.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

if (nextStepBtn) {
  nextStepBtn.addEventListener('click', () => goToStep(2));
}

if (prevStepBtn) {
  prevStepBtn.addEventListener('click', () => goToStep(1));
}

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

// Initialize combobox components lazily when DOM is ready
let genderCombobox = null;
let partnerGenderCombobox = null;
let categoryCombobox = null;
let flightCombobox = null;

function initComboboxes() {
  if (!genderCombobox) genderCombobox = new SearchableCombobox('genderCombobox', 'genderInput', 'genderList');
  if (!partnerGenderCombobox) partnerGenderCombobox = new SearchableCombobox('partnerGenderCombobox', 'partnerGenderInput', 'partnerGenderList');
  if (!categoryCombobox) categoryCombobox = new SearchableCombobox('categoryCombobox', 'categoryInput', 'categoryList');
  if (!flightCombobox) flightCombobox = new SearchableCombobox('flightCombobox', 'flightInput', 'flightList');
}


/**
 * Calculate age based on date of birth string and tournament reference date (Oct 30, 2026)
 */
function calculateAge(dobString, refDateStr = '2026-10-30') {
  if (!dobString) return null;
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return null;
  const refDate = new Date(refDateStr);
  let age = refDate.getFullYear() - birthDate.getFullYear();
  const m = refDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && refDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Returns available event categories based on Gender and Age (as of Oct 30, 2026)
 */
function getAvailableCategories(gender, age) {
  const isMale = gender === 'Male';
  const isFemale = gender === 'Female';

  if (isMale && age !== null && age !== undefined && !isNaN(age) && age <= 17) {
    return ["Mens Doubles", "Boys Doubles", "Mixed Doubles"];
  }

  if (isFemale && age !== null && age !== undefined && !isNaN(age) && age <= 17) {
    return ["Womens Doubles", "Girls Doubles", "Mixed Doubles"];
  }

  if (isMale && age !== null && age !== undefined && !isNaN(age) && age >= 18) {
    return ["Mens Doubles", "Mixed Doubles"];
  }

  if (isFemale && age !== null && age !== undefined && !isNaN(age) && age >= 18) {
    return ["Womens Doubles", "Mixed Doubles"];
  }

  if (isMale) {
    return ["Mens Doubles", "Boys Doubles", "Mixed Doubles"];
  }
  if (isFemale) {
    return ["Womens Doubles", "Girls Doubles", "Mixed Doubles"];
  }
  if (age !== null && age !== undefined && !isNaN(age) && age <= 17) {
    return ["Mens Doubles", "Womens Doubles", "Mixed Doubles", "Girls Doubles", "Boys Doubles"];
  }

  return [
    "Mens Doubles",
    "Womens Doubles",
    "Mixed Doubles",
    "Girls Doubles",
    "Boys Doubles"
  ];
}

/**
 * Returns available level / flight choices based on Gender, Age, and Category
 */
function getAvailableFlights(gender, age, category = '') {
  const isMale = gender === 'Male';
  const isFemale = gender === 'Female';
  const cat = category.toLowerCase();
  const isJuniorCategory = cat.includes('boys') || cat.includes('girls');

  // If Boys Doubles or Girls Doubles is selected: show ONLY junior Under-X levels appropriate for age
  if (isJuniorCategory) {
    if (age !== null && age !== undefined && !isNaN(age)) {
      if (age <= 9) {
        return ["Under 9", "Under 11", "Under 13", "Under 15", "Under 17"];
      } else if (age <= 11) {
        return ["Under 11", "Under 13", "Under 15", "Under 17"];
      } else if (age <= 13) {
        return ["Under 13", "Under 15", "Under 17"];
      } else if (age <= 15) {
        return ["Under 15", "Under 17"];
      } else {
        return ["Under 17"];
      }
    }
    return ["Under 9", "Under 11", "Under 13", "Under 15", "Under 17"];
  }

  // If Mens Doubles, Womens Doubles, or Mixed Doubles is selected: EXCLUDE Under-X levels
  const baseMaleFlights = ["International", "Premiere", "Championship", "F1", "F2", "F3", "F4", "F5", "F6"];
  const baseFemaleFlights = ["Championship", "F1", "F2", "F3", "F4", "F5", "F6"];
  const allBaseFlights = ["International", "Premiere", "Championship", "F1", "F2", "F3", "F4", "F5", "F6"];

  if (isMale) {
    let flights = [...baseMaleFlights];
    if (age !== null && age !== undefined && !isNaN(age)) {
      if (age >= 45) {
        flights.push("Masters 35Plus", "Veterance 45Plus");
      } else if (age >= 35) {
        flights.push("Masters 35Plus");
      }
    } else {
      flights.push("Masters 35Plus", "Veterance 45Plus");
    }
    return flights;
  }

  if (isFemale) {
    let flights = [...baseFemaleFlights];
    return flights;
  }

  // Gender not selected yet: return adult base flights + Masters/Veterans
  let flights = [...allBaseFlights];
  if (age !== null && age !== undefined && !isNaN(age)) {
    if (age >= 45) {
      flights.push("Masters 35Plus", "Veterance 45Plus");
    } else if (age >= 35) {
      flights.push("Masters 35Plus");
    }
  } else {
    flights.push("Masters 35Plus", "Veterance 45Plus");
  }
  return flights;
}

/**
 * Updates Event Category dropdown choices & Age Badge UI elements based on Gender and DOB
 */
function updateCategoryAndAgeUI() {
  initComboboxes();
  const gender = genderInput ? genderInput.value.trim() : '';
  const dob = dobInput ? dobInput.value.trim() : '';
  const age = calculateAge(dob);

  // 1. Update Age Badges in Step 1 and Step 2
  const step1Badge = document.getElementById('step1AgeBadge');
  const step2Badge = document.getElementById('step2AgeBadge');

  if (age !== null && !isNaN(age)) {
    let tagText = '';
    let tagClass = '';
    if (age <= 17) {
      tagText = 'Junior / Kids (≤17)';
      tagClass = 'junior';
    } else if (age < 35) {
      tagText = 'Open Adult';
      tagClass = 'open';
    } else if (age < 45) {
      tagText = 'Masters (35+)';
      tagClass = 'masters';
    } else {
      tagText = 'Veterans (45+)';
      tagClass = 'veterans';
    }

    const badgeText = `Tournament Age: <strong>${age} yrs</strong> (as of Oct 2026)`;

    [step1Badge, step2Badge].forEach(badge => {
      if (badge) {
        const textEl = badge.querySelector('.age-badge-text');
        const tagEl = badge.querySelector('.age-badge-tag');
        if (textEl) textEl.innerHTML = badgeText;
        if (tagEl) {
          tagEl.textContent = tagText;
          tagEl.className = `age-badge-tag ${tagClass}`;
        }
        badge.classList.remove('hidden');
      }
    });
  } else {
    [step1Badge, step2Badge].forEach(badge => {
      if (badge) badge.classList.add('hidden');
    });
  }

  // 2. Compute available categories
  const categories = getAvailableCategories(gender, age);

  // 3. Update categoryCombobox dropdown options
  if (categoryCombobox) {
    categoryCombobox.updateOptions(categories);
  }

  // 4. Reset category if selected value is no longer in available categories
  const currentCategory = categoryInput ? categoryInput.value.trim() : '';
  if (currentCategory && !categories.includes(currentCategory)) {
    if (categoryCombobox) categoryCombobox.reset();
    checkDoublesCategory();
  }

  // 5. Compute available levels / flights
  const selectedCat = categoryInput ? categoryInput.value.trim() : '';
  const flights = getAvailableFlights(gender, age, selectedCat);

  // 6. Update flightCombobox dropdown options
  if (flightCombobox) {
    flightCombobox.updateOptions(flights);
  }

  // 7. Reset flight if selected value is no longer in available flights
  const currentFlight = flightInput ? flightInput.value.trim() : '';
  if (currentFlight && !flights.includes(currentFlight)) {
    if (flightCombobox) flightCombobox.reset();
  }
}

// Category selection change -> show/hide Doubles Partner card & auto-fill partner gender
categoryInput.addEventListener('input', checkDoublesCategory);
categoryInput.addEventListener('change', checkDoublesCategory);

function checkDoublesCategory() {
  initComboboxes();

  const val = categoryInput.value.trim();
  const isDoubles = val.toLowerCase().includes('doubles') || val.toLowerCase().includes('kids') || val.length > 0;

  if (isDoubles) {
    partnerSection.classList.remove('hidden');
    partnerNameInput.setAttribute('required', 'required');
    partnerPhoneInput.setAttribute('required', 'required');
    partnerIqamaInput.setAttribute('required', 'required');
    partnerGenderInput.setAttribute('required', 'required');
    partnerDobInput.setAttribute('required', 'required');
    partnerNationalityInput.setAttribute('required', 'required');
  } else {
    partnerSection.classList.add('hidden');
    [partnerNameInput, partnerPhoneInput, partnerIqamaInput, partnerGenderInput, partnerDobInput, partnerNationalityInput].forEach(inp => {
      inp.removeAttribute('required');
      inp.value = '';
      inp.classList.remove('touched');
    });
    partnerGenderCombobox.reset();
    partnerGenderCombobox.enable();
    ['partnerNameError', 'partnerPhoneError', 'partnerIqamaError', 'partnerGenderError', 'partnerDobError', 'partnerNationalityError'].forEach(errId => {
      const el = document.getElementById(errId);
      if (el) el.textContent = '';
    });
    return;
  }

  // Auto-set & LOCK partner gender based on category and primary player gender
  const primaryGender = genderInput.value.trim();
  let targetPartnerGender = '';

  if (val.includes('Mixed')) {
    if (primaryGender === 'Male') {
      targetPartnerGender = 'Female';
    } else if (primaryGender === 'Female') {
      targetPartnerGender = 'Male';
    }
  } else if (val.includes("Men") || val.includes("Boys")) {
    targetPartnerGender = 'Male';
  } else if (val.includes("Women") || val.includes("Girls")) {
    targetPartnerGender = 'Female';
  }

  if (targetPartnerGender) {
    partnerGenderCombobox.setValue(targetPartnerGender);
    partnerGenderCombobox.disable();
    const errEl = document.getElementById('partnerGenderError');
    if (errEl) errEl.textContent = '';
  } else {
    partnerGenderCombobox.enable();
  }
}

// Regex Validations
const PHONE_REGEX = /^[0-9]{7,15}$/;
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

/**
 * Validates Partner Gender based on selected Event Category and Primary Player Gender
 */
function validatePartnerGender() {
  const input = partnerGenderInput;
  const errorElement = document.getElementById('partnerGenderError');
  if (partnerSection.classList.contains('hidden')) return true;

  const pGender = input.value.trim();
  const primaryGender = genderInput.value.trim();
  const category = categoryInput.value.trim();

  if (!pGender) {
    return validateInput(input, errorElement, null, 'Partner Gender selection is required.');
  }

  if (category.includes("Men") || category.includes("Boys")) {
    if (pGender !== 'Male') {
      return validateInput(input, errorElement, () => false, 'Partner for Mens / Boys Doubles must be Male.');
    }
  } else if (category.includes("Women") || category.includes("Girls")) {
    if (pGender !== 'Female') {
      return validateInput(input, errorElement, () => false, 'Partner for Womens / Girls Doubles must be Female.');
    }
  } else if (category.includes("Mixed")) {
    if (primaryGender === 'Male' && pGender !== 'Female') {
      return validateInput(input, errorElement, () => false, 'Partner for Mixed Doubles must be Female.');
    } else if (primaryGender === 'Female' && pGender !== 'Male') {
      return validateInput(input, errorElement, () => false, 'Partner for Mixed Doubles must be Male.');
    }
  }

  return validateInput(input, errorElement, () => true, '');
}

/**
 * Validates Partner DOB based on date validity and category/flight age limits
 */
function validatePartnerDob() {
  const input = partnerDobInput;
  const errorElement = document.getElementById('partnerDobError');
  if (partnerSection.classList.contains('hidden')) return true;

  const val = input.value.trim();
  if (!val) {
    return validateInput(input, errorElement, null, 'Partner Date of Birth is required.');
  }

  const birthDate = new Date(val);
  if (isNaN(birthDate.getTime())) {
    return validateInput(input, errorElement, () => false, 'Please enter a valid Partner Date of Birth.');
  }

  if (birthDate > new Date()) {
    return validateInput(input, errorElement, () => false, 'Partner Date of Birth cannot be in the future.');
  }

  const pAge = calculateAge(val);
  const category = categoryInput.value.trim();
  const flight = flightInput.value.trim();

  if (flight === 'Under 9' && pAge > 9) {
    return validateInput(input, errorElement, () => false, 'Partner must be age 9 or under for Under 9 level.');
  }
  if (flight === 'Under 11' && pAge > 11) {
    return validateInput(input, errorElement, () => false, 'Partner must be age 11 or under for Under 11 level.');
  }
  if (flight === 'Under 13' && pAge > 13) {
    return validateInput(input, errorElement, () => false, 'Partner must be age 13 or under for Under 13 level.');
  }
  if (flight === 'Under 15' && pAge > 15) {
    return validateInput(input, errorElement, () => false, 'Partner must be age 15 or under for Under 15 level.');
  }
  if ((flight === 'Under 17' || category.includes('Boys') || category.includes('Girls')) && pAge > 17) {
    return validateInput(input, errorElement, () => false, 'Partner must be age 17 or under for junior categories/levels.');
  }
  if (flight === 'Masters 35Plus' && pAge < 35) {
    return validateInput(input, errorElement, () => false, 'Partner must be age 35 or older for Masters 35Plus level.');
  }
  if (flight === 'Veterance 45Plus' && pAge < 45) {
    return validateInput(input, errorElement, () => false, 'Partner must be age 45 or older for Veterance 45Plus level.');
  }

  return validateInput(input, errorElement, () => true, '');
}

function validatePartnerIqama() {
  const input = partnerIqamaInput;
  const errorElement = document.getElementById('partnerIqamaError');
  if (partnerSection.classList.contains('hidden')) return true;

  const val = input.value.trim();
  const primaryIqama = iqamaInput.value.trim();

  if (!val) {
    return validateInput(input, errorElement, null, 'Please enter partner 10-digit Iqama / ID number.');
  }
  if (!IQAMA_REGEX.test(val)) {
    return validateInput(input, errorElement, () => false, 'Please enter partner 10-digit Iqama / ID number.');
  }
  if (primaryIqama && val === primaryIqama) {
    return validateInput(input, errorElement, () => false, 'Partner Iqama / ID cannot be the same as Primary player.');
  }

  return validateInput(input, errorElement, () => true, '');
}

function validatePartnerPhone() {
  const input = partnerPhoneInput;
  const errorElement = document.getElementById('partnerPhoneError');
  if (partnerSection.classList.contains('hidden')) return true;

  const val = input.value.trim();
  const primaryPhone = phoneInput.value.trim();

  if (!val) {
    return validateInput(input, errorElement, null, 'Partner Contact Number is required.');
  }
  if (!PHONE_REGEX.test(val)) {
    return validateInput(input, errorElement, () => false, 'Please enter a valid partner contact number (7-15 digits).');
  }
  if (primaryPhone && val === primaryPhone) {
    return validateInput(input, errorElement, () => false, 'Partner Contact Number cannot be the same as Primary player.');
  }

  return validateInput(input, errorElement, () => true, '');
}

function validatePartnerNationality() {
  const input = partnerNationalityInput;
  const errorElement = document.getElementById('partnerNationalityError');
  if (partnerSection.classList.contains('hidden')) return true;

  const val = input.value.trim();
  if (!val) {
    return validateInput(input, errorElement, null, 'Partner Nationality is required for Doubles.');
  }

  return validateInput(input, errorElement, () => true, '');
}

// Event Listeners for Validation and Dynamic Category Population
genderInput.addEventListener('blur', () => validateInput(genderInput, document.getElementById('genderError'), null, 'Gender selection is required.'));
genderInput.addEventListener('change', () => {
  validateInput(genderInput, document.getElementById('genderError'), null, 'Gender selection is required.');
  updateCategoryAndAgeUI();
  checkDoublesCategory();
  validatePartnerGender();
});

dobInput.addEventListener('blur', () => validateInput(dobInput, document.getElementById('dobError'), null, 'Date of Birth is required.'));
dobInput.addEventListener('change', () => {
  validateInput(dobInput, document.getElementById('dobError'), null, 'Date of Birth is required.');
  updateCategoryAndAgeUI();
  validatePartnerDob();
});
dobInput.addEventListener('input', () => {
  updateCategoryAndAgeUI();
});


nationalityInput.addEventListener('blur', () => validateInput(nationalityInput, document.getElementById('nationalityError'), null, 'Nationality is required.'));
nationalityInput.addEventListener('input', () => nationalityInput.classList.contains('touched') && validateInput(nationalityInput, document.getElementById('nationalityError'), null, 'Nationality is required.'));

clubInput.addEventListener('blur', () => validateInput(clubInput, document.getElementById('clubError'), null, 'Country or Club Name is required.'));
clubInput.addEventListener('input', () => clubInput.classList.contains('touched') && validateInput(clubInput, document.getElementById('clubError'), null, 'Country or Club Name is required.'));

categoryInput.addEventListener('blur', () => validateInput(categoryInput, document.getElementById('categoryError'), null, 'Event category selection is required.'));
categoryInput.addEventListener('input', () => {
  categoryInput.classList.contains('touched') && validateInput(categoryInput, document.getElementById('categoryError'), null, 'Event category selection is required.');
  updateCategoryAndAgeUI();
  validatePartnerGender();
  validatePartnerDob();
});
categoryInput.addEventListener('change', () => {
  updateCategoryAndAgeUI();
  validatePartnerGender();
  validatePartnerDob();
});

flightInput.addEventListener('blur', () => validateInput(flightInput, document.getElementById('flightError'), null, 'Level selection is required.'));
flightInput.addEventListener('input', () => {
  flightInput.classList.contains('touched') && validateInput(flightInput, document.getElementById('flightError'), null, 'Level selection is required.');
  validatePartnerDob();
  validatePartnerGender();
});
flightInput.addEventListener('change', () => {
  validatePartnerDob();
  validatePartnerGender();
});

partnerNameInput.addEventListener('blur', () => {
  if (!partnerSection.classList.contains('hidden')) {
    validateInput(partnerNameInput, document.getElementById('partnerNameError'), null, 'Partner Name is required for Doubles.');
  }
});

partnerPhoneInput.addEventListener('blur', () => {
  validatePartnerPhone();
});
partnerPhoneInput.addEventListener('input', () => {
  partnerPhoneInput.value = partnerPhoneInput.value.replace(/[^0-9]/g, '');
  if (!partnerSection.classList.contains('hidden') && partnerPhoneInput.classList.contains('touched')) {
    validatePartnerPhone();
  }
});

partnerIqamaInput.addEventListener('blur', () => {
  validatePartnerIqama();
});
partnerIqamaInput.addEventListener('input', () => {
  partnerIqamaInput.value = partnerIqamaInput.value.replace(/[^0-9]/g, '');
  if (!partnerSection.classList.contains('hidden') && partnerIqamaInput.classList.contains('touched')) {
    validatePartnerIqama();
  }
});

partnerGenderInput.addEventListener('blur', () => {
  validatePartnerGender();
});
partnerGenderInput.addEventListener('change', () => {
  validatePartnerGender();
});

partnerDobInput.addEventListener('blur', () => {
  validatePartnerDob();
});
partnerDobInput.addEventListener('change', () => {
  validatePartnerDob();
});
partnerDobInput.addEventListener('input', () => {
  if (partnerDobInput.classList.contains('touched')) {
    validatePartnerDob();
  }
});

partnerNationalityInput.addEventListener('blur', () => {
  validatePartnerNationality();
});
partnerNationalityInput.addEventListener('input', () => {
  if (!partnerSection.classList.contains('hidden') && partnerNationalityInput.classList.contains('touched')) {
    validatePartnerNationality();
  }
});

/**
 * Handle form submission
 */
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  generalError.classList.add('hidden');

  const isStep1Valid = validateStep1();
  if (!isStep1Valid) {
    goToStep(1);
    return;
  }

  const isCategoryValid = validateInput(categoryInput, document.getElementById('categoryError'), null, 'Event category selection is required.');
  const isFlightValid = validateInput(flightInput, document.getElementById('flightError'), null, 'Level selection is required.');

  let isPartnerValid = true;
  if (!partnerSection.classList.contains('hidden')) {
    const isPNameValid = validateInput(partnerNameInput, document.getElementById('partnerNameError'), null, 'Partner Name is required for Doubles.');
    const isPPhoneValid = validatePartnerPhone();
    const isPIqamaValid = validatePartnerIqama();
    const isPGenderValid = validatePartnerGender();
    const isPDobValid = validatePartnerDob();
    const isPNationalityValid = validatePartnerNationality();
    isPartnerValid = isPNameValid && isPPhoneValid && isPIqamaValid && isPGenderValid && isPDobValid && isPNationalityValid;
  }

  if (!isCategoryValid || !isFlightValid || !isPartnerValid) {
    [categoryInput, flightInput].forEach(inp => inp.classList.add('touched'));
    if (!partnerSection.classList.contains('hidden')) {
      [partnerNameInput, partnerPhoneInput, partnerIqamaInput, partnerGenderInput, partnerDobInput, partnerNationalityInput].forEach(inp => inp.classList.add('touched'));
    }
    return;
  }

  setSubmittingState(true);

  const primaryCodeEl = document.getElementById('countryCodeSelect');
  const primaryCode = primaryCodeEl ? primaryCodeEl.value.replace('+', '') : '966';

  const partnerCodeEl = document.getElementById('partnerCountryCodeSelect');
  const partnerCode = partnerCodeEl ? partnerCodeEl.value.replace('+', '') : '966';

  const rawPhone = phoneInput.value.trim().replace(/^0+/, '');
  const rawPartnerPhone = partnerPhoneInput.value.trim().replace(/^0+/, '');

  const payload = {
    name: nameInput.value.trim(),
    phone: primaryCode + rawPhone,
    email: emailInput.value.trim(),
    iqama: iqamaInput.value.trim(),
    gender: genderInput.value.trim(),
    dob: dobInput.value.trim(),
    nationality: nationalityInput.value.trim(),
    club: clubInput.value.trim(),
    category: categoryInput.value.trim(),
    flight: flightInput.value.trim(),
    partnerName: partnerSection.classList.contains('hidden') ? '' : partnerNameInput.value.trim(),
    partnerPhone: partnerSection.classList.contains('hidden') ? '' : partnerCode + rawPartnerPhone,
    partnerIqama: partnerSection.classList.contains('hidden') ? '' : partnerIqamaInput.value.trim(),
    partnerGender: partnerSection.classList.contains('hidden') ? '' : partnerGenderInput.value.trim(),
    partnerDob: partnerSection.classList.contains('hidden') ? '' : partnerDobInput.value.trim(),
    partnerNationality: partnerSection.classList.contains('hidden') ? '' : partnerNationalityInput.value.trim()
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
  [nameInput, phoneInput, emailInput, iqamaInput, genderInput, dobInput, nationalityInput, clubInput, categoryInput, flightInput, partnerNameInput, partnerPhoneInput, partnerIqamaInput, partnerGenderInput, partnerDobInput, partnerNationalityInput].forEach(inp => inp.disabled = isSubmitting);

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
  updateCategoryAndAgeUI();

  [nameInput, phoneInput, emailInput, iqamaInput, genderInput, dobInput, nationalityInput, clubInput, categoryInput, flightInput, partnerNameInput, partnerPhoneInput, partnerIqamaInput, partnerGenderInput, partnerDobInput, partnerNationalityInput].forEach(inp => {
    inp.classList.remove('touched');
    inp.disabled = false;
  });

  goToStep(1);

  successPanel.classList.remove('active');

  setTimeout(() => {
    formPanel.classList.add('active');
    generalError.classList.add('hidden');
  }, 300);
});

window.addEventListener('DOMContentLoaded', () => {
  startIntroProgress();
  updateCategoryAndAgeUI();
});


