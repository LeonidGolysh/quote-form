const clientDomain = document.referrer ? new URL(document.referrer).hostname : 'unknown';

document.addEventListener('DOMContentLoaded', () => {

  var formHTML = `
  <div id="loader" style="display: flex;">
    <div id="spinner"></div>
  </div>

  <div class="form-fields">
    <h2>30-second Quote</h2>
    <h3>Save instant 10%, receive instant email</h3>
    <div class="fields">
      <form id="quoteForm">
        <div class="form-body">
          <div>
            <label for="first_name" class="required-label">First Name:</label>
            <input type="text" name="first_name" id="first_name" required>
          </div>
              
          <div>
            <label for="last_name" class="required-label">Last Name:</label>
            <input type="text" name="last_name" id="last_name" required>
          </div>
              
          <div>
            <label for="phone" class="required-label">Phone:</label>
            <input type="text" name="phone" id="phone" required>
          </div>
              
          <div>
            <label for="email" class="required-label">Email:</label>
            <input type="text" name="email" id="email" required>
          </div>
              
          <div>
            <label for="zip_code" class="required-label">Zip Code:</label>
            <input type="text" name="zip_code" id="zip_code" required>
          </div>
              
          <div>
            <label for="hear_about" class="required-label">How did you hear about us?:</label>
            <select name="hear_about" id="hear_about" required>
              <option value="">--Select type--</option>
            </select>
          </div>
              
          <div>
            <label for="type_location" class="required-label">Location Type:</label>
            <select name="type_location" id="type_location" required>
              <option value="">--Select type location--</option>
            </select>
          </div>
              
          <div>
            <label for="service_type" class="required-label">Service Type:</label>
            <select name="service_type" id="service_type" required>
              <option value="">--Select a service--</option>
            </select>
          </div>
              
          <div>
            <label for="square_footage" class="required-label">Square Footage:</label>
            <select name="square_footage" id="square_footage" required>
              <option value="">--Select square footage--</option>
            </select>
          </div>

          <div class="consent-text">Consent</div>

          <div class="checkbox-container">
            <input type="checkbox" id="terms" required>
            <label for="terms">I agree to the terms of service</label>
          </div>

          <div class="terms-notice">
            By submitting this form, you are acknowledging you would like to be contacted by Maids and
            Moore at the phone number provided. Maids and Moore may contact you about its services through
            various automated and recorded means including telephone, text and email. Note: Messaging frequency may vary and data rates may apply.
          </div>

          <button id="submit">Submit</button>
        </div>
      </form>
    </div>
  </div>`;
  
  const quoteFormContainer = document.getElementById('quoteForm');
  
  if (quoteFormContainer) {
    quoteFormContainer.innerHTML = formHTML;

    applyThemeFromURL();
  } else {
    console.log('Error: Element with id "quoteForm" not found');
    return;
  }

  //Universal function for getting field values
  const getFormFieldValue = (id, parseFn = val => val.trim()) =>
    parseFn(document.getElementById(id)?.value || '');

  const validateFormData = formData => {
    const requiredFields = [
      'client_first_name',
      'client_last_name',
      'client_phone',
      'client_email',
      'zip_code',
      'hear_about_id',
      'type_location_id',
      'service_type_id',
      'square_footage_id',
    ];

    for (const field of requiredFields) {
      if (formData[field] === '' || (typeof formData[field] === 'number' && isNaN(formData[field]))) {
        return `Please fill in all fields correctly. Missing: ${field}`;
      }
    }

    const termsCheckbox = document.getElementById('terms'); 
    if (!termsCheckbox.checked) {
      return 'Please agree to the terms of service before submitting.';
    }

    return null;
  }

  const handleErrors = error => {
    console.error('Error: ', error);
    alert(error.message || 'An error occurred. Pleas try again');
  };

  quoteFormContainer.addEventListener('submit', async function (event) {
    event.preventDefault();

    //Data to send
    const formData = {
      client_first_name: getFormFieldValue('first_name'),
      client_last_name: getFormFieldValue('last_name'),
      client_phone: getFormFieldValue('phone'),
      client_email: getFormFieldValue('email'),
      zip_code: getFormFieldValue('zip_code'),
      hear_about_id: getFormFieldValue('hear_about', val => parseInt(val, 10)),
      type_location_id: getFormFieldValue('type_location', val => parseInt(val, 10)),
      service_type_id: getFormFieldValue('service_type', val => parseInt(val, 10)),
      square_footage_id: getFormFieldValue('square_footage', val => parseInt(val, 10)),
    };

    const validationError = validateFormData(formData);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const result = await submitForm(formData);
      if (result.success) {
        alert(result.message || 'Form submitted successfully');
      } else {
        alert('Unknown error. Please try again');
      }
    } catch (error) {
      handleErrors(error);
    }
  });

  window.onload = function () {
    if (typeof grecaptcha !== 'undefined') {
      grecaptcha.ready(onReCaptchaLoad);
    } else {
      console.error('reCaptcha not loaded');
    }
  }
});

async function submitForm(formData) {
  try {
    const recaptchaToken = await grecaptcha.execute('6Le040AqAAAAANpuTZ9SlXSOO78-AYfUs0AyyYjI', { action: 'submit' });
    
    if (!recaptchaToken) {
      console.error('Failed to get reCAPTCHA token.');
      return;
    }
    
    //Send POST req
    const response = await fetch('https://api-dev.thecleaningsoftware.com/api/quotes',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': clientDomain,
        'tcs-recaptcha-token': recaptchaToken
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorData = await response.json();

      if (errorData.errors) {
        const errorMessage = errorData.errors
          .map(err => `${err.property}: ${Object.values(err.constraints).join(', ')}`)
          .join('\n');
        throw new Error(`Validation error:\n${errorMessage}`);
      }

      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'An error occurred during form submission.');
  }
}

function onReCaptchaLoad() {
  if (typeof grecaptcha !== 'undefined') {
    grecaptcha.ready(() => {
      fetchInitFormData();
    });
  } else {
    console.error('reCaptcha not loaded');
  }
}

// Function for getting data from api
async function fetchInitFormData() {
  try {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = 'flex';
    }

    const recaptchaToken = await grecaptcha.execute('6Le040AqAAAAANpuTZ9SlXSOO78-AYfUs0AyyYjI', { action: 'submit' });

    if (!recaptchaToken) {
      console.error('Failed to get reCAPTCHA token.');
      return;
    }
    
    const response = await fetch('https://api-dev.thecleaningsoftware.com/api/quotes/init-form', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': clientDomain,
        'tcs-recaptcha-token': recaptchaToken
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch from data');
    }

    const data = await response.json();

    //Checking the data structure and filling out the form
    if (data && data.data) {
      populateForm(data.data);
    } else {
      console.error('Invalid data structure from server');
    }
  } catch(error) {
    console.log('Error fetching init from data: ', error);
  } finally {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = 'none';
    }
  }
}
  
//Function for dynamically filling form fields
function populateForm(data) {
  const populateSelect = (selectId, items, valueKey, textKey) => {
    const selectElement = document.getElementById(selectId);
    if (!selectElement || !items) return;

    // selectElement.innerHTML = '';

    items.forEach(item => {
      const option = document.createElement('option');
      option.value = item[valueKey];
      option.textContent = item[textKey];
      selectElement.appendChild(option);
    });
  };

  populateSelect('service_type', data.services, 'id', 'name');
  populateSelect('square_footage', data.square_footages, 'id', 'range_limit');
  populateSelect('hear_about', data.hear_about_types, 'id', 'name');
  populateSelect('type_location', data.locations, 'id', 'name');
}