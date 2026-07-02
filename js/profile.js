import { ensureAuthenticated, renderSidebar, initLogoutButton, applyStoredTheme, getProfile, saveProfile, createElement, getSettings } from './common.js';
import { validateProfileForm, formatValidationMessage } from './validation.js';

class ProfileController {
  constructor() {
    this.profile = getProfile();
    this.isEditing = false;
    this.form = document.getElementById('profileForm');
    this.messageBox = document.getElementById('profileMessage');
    this.init();
  }

  init() {
    if (!ensureAuthenticated()) {
      return;
    }
    applyStoredTheme();
    renderSidebar('profile.html');
    initLogoutButton();
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    document.getElementById('editProfileBtn').addEventListener('click', () => this.enableEditing());
    document.getElementById('saveProfileBtn').addEventListener('click', () => this.saveProfile());
    document.getElementById('cancelProfileBtn').addEventListener('click', () => this.cancelEditing());
    this.form.addEventListener('submit', (event) => event.preventDefault());
  }

  render() {
    document.getElementById('profileName').textContent = this.profile.name;
    document.getElementById('profileRole').textContent = this.profile.role;
    document.getElementById('profileAvatar').textContent = this.profile.name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase();
    document.getElementById('profileNameInput').value = this.profile.name;
    document.getElementById('profileEmailInput').value = this.profile.email;
    document.getElementById('profilePhoneInput').value = this.profile.phone;
    document.getElementById('profileDepartmentInput').value = this.profile.department;
    document.getElementById('profileRoleInput').value = this.profile.role;
    document.getElementById('profileDateInput').value = this.profile.joiningDate;
    document.getElementById('profileAddressInput').value = this.profile.address;
    document.getElementById('profileSkillsInput').value = this.profile.skills;
    this.setEditingState(false);
  }

  enableEditing() {
    this.setEditingState(true);
  }

  saveProfile() {
    const updatedProfile = {
      name: document.getElementById('profileNameInput').value.trim(),
      email: document.getElementById('profileEmailInput').value.trim(),
      phone: document.getElementById('profilePhoneInput').value.trim(),
      department: document.getElementById('profileDepartmentInput').value.trim(),
      role: document.getElementById('profileRoleInput').value.trim(),
      joiningDate: document.getElementById('profileDateInput').value,
      address: document.getElementById('profileAddressInput').value.trim(),
      skills: document.getElementById('profileSkillsInput').value.trim(),
    };

    const errors = validateProfileForm(updatedProfile);
    if (errors.length > 0) {
      this.showMessage(formatValidationMessage(errors), 'error');
      return;
    }

    this.profile = updatedProfile;
    saveProfile(this.profile);
    this.render();
    this.showMessage('Profile updated successfully.', 'success');
  }

  cancelEditing() {
    this.profile = getProfile();
    this.render();
    this.showMessage('Changes discarded.', 'success');
  }

  setEditingState(isEditing) {
    this.isEditing = isEditing;
    const inputs = Array.from(this.form.querySelectorAll('input, textarea'));
    inputs.forEach((input) => input.disabled = !isEditing);
    document.getElementById('editProfileBtn').classList.toggle('hidden', isEditing);
    document.getElementById('saveProfileBtn').classList.toggle('hidden', !isEditing);
    document.getElementById('cancelProfileBtn').classList.toggle('hidden', !isEditing);
  }

  showMessage(message, type) {
    this.messageBox.textContent = message;
    this.messageBox.className = `form-message ${type}`;
  }
}

new ProfileController();
