function validateRequired(value) {
  return Boolean(value && value.trim().length > 0);
}

function validatePassword(value) {
  return value.length >= 6;
}

function validateLoginForm(employeeId, password) {
  const errors = [];
  if (!validateRequired(employeeId)) {
    errors.push('Employee ID is required.');
  }
  if (!validatePassword(password)) {
    errors.push('Password must be at least 6 characters.');
  }
  return errors;
}

function validateProfileForm(profile) {
  const errors = [];
  if (!validateRequired(profile.name)) {
    errors.push('Name is required.');
  }
  if (!validateRequired(profile.email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    errors.push('A valid email is required.');
  }
  if (!validateRequired(profile.phone)) {
    errors.push('Phone number is required.');
  }
  return errors;
}

function validateSettingsForm(settings) {
  const errors = [];
  if (settings.newPassword && settings.newPassword.length < 6) {
    errors.push('New password must be at least 6 characters.');
  }
  if (settings.newPassword && settings.newPassword !== settings.confirmPassword) {
    errors.push('Passwords do not match.');
  }
  return errors;
}

function formatValidationMessage(errors) {
  return errors.join(' ');
}

function createValidator() {
  return {
    validateRequired,
    validatePassword,
    validateLoginForm,
    validateProfileForm,
    validateSettingsForm,
    formatValidationMessage,
  };
}

export {
  validateRequired,
  validatePassword,
  validateLoginForm,
  validateProfileForm,
  validateSettingsForm,
  formatValidationMessage,
  createValidator,
};
