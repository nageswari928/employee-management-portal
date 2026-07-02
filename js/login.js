import { setAuthSession, getAuthSession, saveSettings, getSettings, applyStoredTheme } from './common.js';
import { validateLoginForm, formatValidationMessage } from './validation.js';

class LoginController {
  constructor() {
    this.form = document.getElementById('loginForm');
    this.employeeIdInput = document.getElementById('employeeId');
    this.passwordInput = document.getElementById('password');
    this.togglePasswordButton = document.getElementById('togglePassword');
    this.rememberMeInput = document.getElementById('rememberMe');
    this.messageBox = document.getElementById('loginMessage');
    this.init();
  }

  init() {
    applyStoredTheme();
    const existingSession = getAuthSession();
    if (existingSession) {
      window.location.href = './dashboard.html';
      return;
    }

    this.form.addEventListener('submit', (event) => this.handleSubmit(event));
    this.togglePasswordButton.addEventListener('click', () => this.togglePasswordVisibility());
    this.form.addEventListener('reset', () => this.clearMessage());
    this.employeeIdInput.addEventListener('input', () => this.clearMessage());
    this.passwordInput.addEventListener('input', () => this.clearMessage());
  }

  togglePasswordVisibility() {
    const isPassword = this.passwordInput.type === 'password';
    this.passwordInput.type = isPassword ? 'text' : 'password';
    this.togglePasswordButton.textContent = isPassword ? 'Hide' : 'Show';
  }

  clearMessage() {
    this.messageBox.textContent = '';
    this.messageBox.className = 'form-message';
  }

  async handleSubmit(event) {
    event.preventDefault();
    const employeeId = this.employeeIdInput.value.trim();
    const password = this.passwordInput.value;
    const rememberMe = this.rememberMeInput.checked;
    const errors = validateLoginForm(employeeId, password);

    if (errors.length > 0) {
      this.showMessage(formatValidationMessage(errors), 'error');
      return;
    }
    // Load employees from JSON
    const response = await fetch('./data/employees.json');
    const users = await response.json();

    // Check credentials
    const validUser = users.find(
    user =>
        user.employeeId === employeeId &&
        user.password === password
    );

    if (!validUser) {
        this.showMessage('Invalid Employee ID or Password', 'error');
        return;
    }

    const settings = getSettings();
    settings.rememberMe = rememberMe;
    saveSettings(settings);

    setAuthSession(employeeId);
    this.showMessage('Authentication successful. Redirecting...', 'success');
    window.setTimeout(() => {
      window.location.href = './dashboard.html';
    }, 400);
  }

  showMessage(message, type) {
    this.messageBox.textContent = message;
    this.messageBox.className = `form-message ${type}`;
  }
}

new LoginController();
