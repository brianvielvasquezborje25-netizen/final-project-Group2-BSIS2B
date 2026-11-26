
const API_BASE_URL = "https://bufoodhub.onrender.com";

document.addEventListener('DOMContentLoaded', function () {
  const registerForm = document.getElementById('registerForm');
  const firstNameEl = document.getElementById('firstName');
  const lastNameEl = document.getElementById('lastName');
  const emailEl = document.getElementById('email');
  const sectionEl = document.getElementById('section');
  const roleEl = document.getElementById('role');
  const passwordEl = document.getElementById('password');
  const confirmPasswordEl = document.getElementById('confirmPassword');
  const confirmFeedbackEl = document.getElementById('confirmFeedback');
  const errorBox = document.getElementById('registerError');

  function showError(message) {
    if (!errorBox) {
      alert(message);
      return;
    }

    errorBox.textContent = message;
    errorBox.classList.remove('d-none');
    errorBox.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  function clearError() {
    if (errorBox) {
      errorBox.textContent = '';
      errorBox.classList.add('d-none');
    }
  }

  function validatePasswordMatch() {
    if (!passwordEl || !confirmPasswordEl) return true;

    const matches =
      confirmPasswordEl.value === passwordEl.value;

    if (!matches && confirmPasswordEl.value.length > 0) {
      const msg = 'Passwords must match.';

      confirmPasswordEl.setCustomValidity(msg);

      if (confirmFeedbackEl) {
        confirmFeedbackEl.textContent = msg;
      }

      return false;
    }

    confirmPasswordEl.setCustomValidity('');

    if (confirmFeedbackEl) {
      confirmFeedbackEl.textContent = 'Passwords must match.';
    }

    return matches;
  }

  emailEl?.addEventListener('input', function () {
    this.setCustomValidity('');
    clearError();
  });

  passwordEl?.addEventListener('input', function () {
    validatePasswordMatch();
    clearError();
  });

  confirmPasswordEl?.addEventListener('input', function () {
    validatePasswordMatch();
    clearError();
  });

  registerForm?.addEventListener('submit', async function (e) {
    e.preventDefault();
    clearError();

    const firstName = firstNameEl?.value.trim() || '';
    const lastName = lastNameEl?.value.trim() || '';
    const name = `${firstName} ${lastName}`.trim();

    const email =
      emailEl?.value.trim().toLowerCase() || '';

    const section =
      sectionEl?.value.trim() || '';

    const role = roleEl?.value || '';
    const password = passwordEl?.value || '';

    emailEl?.setCustomValidity('');
    validatePasswordMatch();

    if (!registerForm.checkValidity()) {
      registerForm.classList.add('was-validated');

      if (passwordEl?.value !== confirmPasswordEl?.value) {
        showError('Passwords do not match.');
      } else {
        showError('Please complete all required fields properly.');
      }

      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
            section
          })
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
       const successModal = new bootstrap.Modal(document.getElementById('registerSuccessModal'));
        successModal.show();
        document.getElementById('confirmRegisterBtn').addEventListener('click', () => {
          window.location.href = 'login.html'; // Change to your login filename if different
      });
              return;
      }

      const errorMsg =
        data.message ||
        data.error ||
        'Registration failed. Please try again.';

      const isDuplicateEmail =
        response.status === 409 ||
        /already (registered|exists|used)/i.test(errorMsg);

      if (isDuplicateEmail && emailEl) {
        emailEl.setCustomValidity(errorMsg);
        registerForm.classList.add('was-validated');
      }

      showError(errorMsg);

    } catch (error) {
      console.error('Registration error:', error);

      showError(
        'Cannot connect to the server. Please check your internet connection or try again later.'
      );
    }
  });
});
