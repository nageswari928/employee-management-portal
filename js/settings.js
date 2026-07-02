import { ensureAuthenticated, renderSidebar, initLogoutButton, applyStoredTheme, getSettings, saveSettings, createElement } from './common.js';
import { validateSettingsForm, formatValidationMessage } from './validation.js';

class SettingsController {
  constructor() {
    this.settings = getSettings();
    this.form = document.getElementById('settingsForm');
    this.messageBox = document.getElementById('settingsMessage');
    this.init();
  }

  init() {
    if (!ensureAuthenticated()) {
      return;
    }
    applyStoredTheme();
    renderSidebar('settings.html');
    initLogoutButton();
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    this.form.addEventListener('submit', (event) => this.handleSave(event));
    document.getElementById('resetSettingsBtn').addEventListener('click', () => this.resetSettings());
  }

  render() {
    document.getElementById('themeToggle').value = this.settings.theme || 'light';
    document.getElementById('languageSelect').value = this.settings.language || 'en';
    document.getElementById('notificationToggle').checked = this.settings.notificationsEnabled !== false;
    document.getElementById('autoLogoutToggle').checked = this.settings.autoLogoutEnabled !== false;
  }

  handleSave(event) {
    event.preventDefault();
    const formData = {
      theme: document.getElementById('themeToggle').value,
      language: document.getElementById('languageSelect').value,
      notificationsEnabled: document.getElementById('notificationToggle').checked,
      autoLogoutEnabled: document.getElementById('autoLogoutToggle').checked,
      newPassword: document.getElementById('newPassword').value,
      confirmPassword: document.getElementById('confirmPassword').value,
    };
    const errors = validateSettingsForm(formData);
    if (errors.length > 0) {
      this.showMessage(formatValidationMessage(errors), 'error');
      return;
    }

    this.settings = { ...this.settings, ...formData };
    saveSettings(this.settings);
    applyStoredTheme();
    this.showMessage('Settings saved successfully.', 'success');
  }

  resetSettings() {
    this.settings = {
      theme: 'light',
      language: 'en',
      notificationsEnabled: true,
      autoLogoutEnabled: true,
    };
    saveSettings(this.settings);
    applyStoredTheme();
    this.render();
    this.showMessage('Settings reset to defaults.', 'success');
  }

  showMessage(message, type) {
    this.messageBox.textContent = message;
    this.messageBox.className = `form-message ${type}`;
  }
}

new SettingsController();
