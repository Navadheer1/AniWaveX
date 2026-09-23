/**
 * AniWaveX - Authentication Controller (Login & Registration)
 * Form validation, live password strength meter, and localStorage persistence.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAuthForm();
});

function initAuthForm() {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const demoLoginBtn = document.getElementById('demoLoginBtn');
  const passwordInput = document.getElementById('passwordInput');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');

  // Toggle Password Visibility
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPass = passwordInput.type === 'password';
      passwordInput.type = isPass ? 'text' : 'password';
      togglePasswordBtn.innerHTML = isPass
        ? `<svg viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>`
        : `<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;
    });
  }

  // Real-time Password Strength Meter (on Sign Up page)
  if (passwordInput && document.getElementById('strengthBarFill')) {
    passwordInput.addEventListener('input', () => {
      evaluatePasswordStrength(passwordInput.value);
    });
  }

  // Quick Demo Login Action
  if (demoLoginBtn) {
    demoLoginBtn.addEventListener('click', () => {
      const emailField = document.getElementById('emailInput');
      const passField = document.getElementById('passwordInput');
      if (emailField) emailField.value = 'demo@aniwavex.com';
      if (passField) passField.value = 'AniWaveX2026!';
      performLogin('OtakuPrime', 'demo@aniwavex.com');
    });
  }

  // Login Form Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('emailInput').value.trim();
      const password = document.getElementById('passwordInput').value.trim();

      let valid = true;
      if (!validateEmail(email)) {
        showError('emailInput', 'Please enter a valid email address');
        valid = false;
      } else {
        clearError('emailInput');
      }

      if (!password || password.length < 6) {
        showError('passwordInput', 'Password must be at least 6 characters');
        valid = false;
      } else {
        clearError('passwordInput');
      }

      if (valid) {
        const username = email.split('@')[0];
        performLogin(username, email);
      }
    });
  }

  // Sign Up Form Submission
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('usernameInput').value.trim();
      const email = document.getElementById('emailInput').value.trim();
      const password = document.getElementById('passwordInput').value.trim();
      const confirmPassword = document.getElementById('confirmPasswordInput').value.trim();

      let valid = true;

      if (!username || username.length < 3) {
        showError('usernameInput', 'Username must be at least 3 characters');
        valid = false;
      } else {
        clearError('usernameInput');
      }

      if (!validateEmail(email)) {
        showError('emailInput', 'Please enter a valid email address');
        valid = false;
      } else {
        clearError('emailInput');
      }

      if (!password || password.length < 6) {
        showError('passwordInput', 'Password must be at least 6 characters');
        valid = false;
      } else {
        clearError('passwordInput');
      }

      if (password !== confirmPassword) {
        showError('confirmPasswordInput', 'Passwords do not match');
        valid = false;
      } else {
        clearError('confirmPasswordInput');
      }

      if (valid) {
        performLogin(username, email, true);
      }
    });
  }
}

function evaluatePasswordStrength(password) {
  const barFill = document.getElementById('strengthBarFill');
  const textLabel = document.getElementById('strengthText');
  if (!barFill || !textLabel) return;

  if (!password) {
    barFill.style.width = '0%';
    barFill.style.backgroundColor = 'transparent';
    textLabel.textContent = 'None';
    return;
  }

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) {
    barFill.style.width = '25%';
    barFill.style.backgroundColor = '#e63946';
    textLabel.textContent = 'Weak';
    textLabel.style.color = '#e63946';
  } else if (score === 2) {
    barFill.style.width = '50%';
    barFill.style.backgroundColor = '#f77f00';
    textLabel.textContent = 'Fair';
    textLabel.style.color = '#f77f00';
  } else if (score === 3 || score === 4) {
    barFill.style.width = '75%';
    barFill.style.backgroundColor = '#2a9d8f';
    textLabel.textContent = 'Good';
    textLabel.style.color = '#2a9d8f';
  } else {
    barFill.style.width = '100%';
    barFill.style.backgroundColor = '#2ecc71';
    textLabel.textContent = 'Strong';
    textLabel.style.color = '#2ecc71';
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const wrap = input.closest('.form-input-wrap');
  if (wrap) wrap.classList.add('has-error');

  const group = input.closest('.form-group');
  let err = group ? group.querySelector('.form-error-msg') : null;
  if (!err) {
    err = document.createElement('div');
    err.className = 'form-error-msg';
    group.appendChild(err);
  }
  err.textContent = message;
  err.classList.add('visible');
}

function clearError(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const wrap = input.closest('.form-input-wrap');
  if (wrap) wrap.classList.remove('has-error');

  const group = input.closest('.form-group');
  const err = group ? group.querySelector('.form-error-msg') : null;
  if (err) err.classList.remove('visible');
}

function performLogin(username, email, isNewUser = false) {
  const user = {
    username,
    email,
    loggedIn: true,
    joinedAt: Date.now()
  };

  Storage.setUser(user);
  showToast(isNewUser ? `Account created! Welcome, ${username}!` : `Welcome back, ${username}!`, 'success');

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 600);
}
