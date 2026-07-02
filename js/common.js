const STORAGE_KEYS = {
  auth: 'employeePortalAuth',
  profile: 'employeePortalProfile',
  settings: 'employeePortalSettings',
  notifications: 'employeePortalNotifications',
  employees: 'employeePortalEmployees',
};

const DEFAULT_PROFILE = {
  name: 'Jane Doe',
  email: 'jane.doe@northstar.com',
  phone: '+1 415 555 0133',
  department: 'Operations',
  role: 'Senior Business Analyst',
  joiningDate: '2020-02-14',
  address: '42 Harbor Avenue, San Francisco, CA',
  skills: 'Analytics, Strategy, Cross-functional Leadership',
};

const DEFAULT_SETTINGS = {
  theme: 'light',
  language: 'en',
  notificationsEnabled: true,
  autoLogoutEnabled: true,
};

const navItems = [
  { label: 'Dashboard', page: 'dashboard.html', icon: '▣' },
  { label: 'Employees', page: 'employees.html', icon: '👥' },
  { label: 'Profile', page: 'profile.html', icon: '👤' },
  { label: 'Settings', page: 'settings.html', icon: '⚙️' },
  { label: 'Notifications', page: 'notifications.html', icon: '🔔' },
  { label: 'About', page: 'about.html', icon: 'ℹ️' },
];

function createElement(tag, className = '', text = '') {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.textContent = text;
  }
  return element;
}

function formatDate(dateString) {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getCurrentDate() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function getCurrentTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function setAuthSession(userId = 'EMP001') {
  localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify({ userId, rememberMe: true, loginTime: new Date().toISOString() }));
}

function getAuthSession() {
  const raw = localStorage.getItem(STORAGE_KEYS.auth);
  return raw ? JSON.parse(raw) : null;
}

function logoutUser() {
  localStorage.removeItem(STORAGE_KEYS.auth);
  window.location.href = './login.html';
}

function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
}

function getProfile() {
  const raw = localStorage.getItem(STORAGE_KEYS.profile);
  if (raw) {
    return JSON.parse(raw);
  }
  saveProfile(DEFAULT_PROFILE);
  return DEFAULT_PROFILE;
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

function getSettings() {
  const raw = localStorage.getItem(STORAGE_KEYS.settings);
  if (raw) {
    return JSON.parse(raw);
  }
  saveSettings(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

function setTheme(theme) {
  document.body.dataset.theme = theme;
}

function applyStoredTheme() {
  const settings = getSettings();
  setTheme(settings.theme || 'light');
}

async function loadJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Unable to load data');
  }
  return response.json();
}

function ensureAuthenticated() {
  const session = getAuthSession();
  if (!session) {
    window.location.href = './login.html';
    return false;
  }
  return true;
}

function renderSidebar(activePage = 'dashboard.html') {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) {
    return;
  }
  const brand = createElement('div', 'brand');
  const mark = createElement('div', 'brand-mark', 'EP');
  const titleWrap = createElement('div');
  const title = createElement('strong', '', 'Northstar');
  const subtitle = createElement('p', '', 'Employee Portal');
  subtitle.style.margin = '2px 0 0';
  subtitle.style.color = '#b5c8ff';
  titleWrap.append(title, subtitle);
  brand.append(mark, titleWrap);
  const nav = createElement('nav', 'nav-list');
  navItems.forEach((item) => {
    const link = createElement('a', `nav-item${item.page === activePage ? ' active' : ''}`);
    link.id = `nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`;
    link.href = `./${item.page}`;
    link.dataset.testid = `nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`;
    link.innerHTML = `<span>${item.icon}</span><span>${item.label}</span>`;
    nav.append(link);
  });
  sidebar.innerHTML = '';
  sidebar.append(brand, nav);
}

function initLogoutButton() {
  const button = document.getElementById('logoutBtn');
  if (!button) {
    return;
  }
  button.addEventListener('click', () => {
    const modal = document.getElementById('logoutModal');
    if (modal) {
      modal.classList.add('active');
    }
  });

  const confirm = document.getElementById('confirmLogoutBtn');
  const cancel = document.getElementById('cancelLogoutBtn');
  const modal = document.getElementById('logoutModal');
  if (confirm) {
    confirm.addEventListener('click', () => {
      logoutUser();
    });
  }
  if (cancel) {
    cancel.addEventListener('click', () => {
      modal?.classList.remove('active');
    });
  }
}

function registerPageHooks() {
  renderSidebar(getCurrentPageName());
  applyStoredTheme();
  initLogoutButton();
}

function getCurrentPageName() {
  const path = window.location.pathname.split('/').pop() || 'dashboard.html';
  return path;
}

function attachValidationState(element, isValid) {
  element.classList.toggle('error', !isValid);
}

function debounce(fn, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
}

function createSummaryCard(title, value, detail) {
  const card = createElement('article', 'stat-card');
  card.dataset.testid = 'dashboard-card';
  const h3 = createElement('h3', '', title);
  const strong = createElement('strong', '', value);
  const p = createElement('p', '', detail);
  p.style.margin = '8px 0 0';
  p.style.color = 'var(--muted)';
  card.append(h3, strong, p);
  return card;
}

function createActivityItem(text, meta) {
  const item = createElement('div', 'activity-item');
  item.innerHTML = `<strong>${text}</strong><div>${meta}</div>`;
  return item;
}

function createNotificationItem(notification) {
  const card = createElement('article', `notification-card${notification.read ? '' : ' unread'}`);
  card.innerHTML = `<div class="form-row"><strong>${notification.title}</strong><span class="badge">${notification.category}</span></div><p>${notification.message}</p><div class="form-row"><small>${formatDateTime(notification.timestamp)}</small><div class="panel-actions"></div></div>`;
  const readButton = createElement('button', 'btn secondary', notification.read ? 'Mark as Unread' : 'Mark as Read');
  readButton.dataset.testid = `notification-mark-${notification.id}`;
  readButton.addEventListener('click', () => toggleNotificationRead(notification.id));
  const deleteButton = createElement('button', 'btn secondary', 'Delete');
  deleteButton.dataset.testid = `notification-delete-${notification.id}`;
  deleteButton.addEventListener('click', () => deleteNotification(notification.id));
  card.querySelector('.panel-actions').append(readButton, deleteButton);
  return card;
}

function toggleNotificationRead(id) {
  const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.notifications) || '[]');
  const updated = items.map((item) => (item.id === id ? { ...item, read: !item.read } : item));
  localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(updated));
  window.location.reload();
}

function deleteNotification(id) {
  const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.notifications) || '[]');
  const updated = items.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(updated));
  window.location.reload();
}

function getNotifications() {
  const raw = localStorage.getItem(STORAGE_KEYS.notifications);
  if (raw) {
    return JSON.parse(raw);
  }
  return [];
}

function saveNotifications(notifications) {
  localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^[+\d\s()-]{7,}$/.test(phone);
}

function generateId(prefix = 'item') {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function createEmptyState(message) {
  const container = createElement('div', 'panel');
  container.innerHTML = `<p>${message}</p>`;
  return container;
}

function sortEmployees(list, key) {
  const sorted = [...list];
  sorted.sort((first, second) => {
    if (key === 'joiningDate') {
      return new Date(first.joiningDate) - new Date(second.joiningDate);
    }
    if (key === 'department') {
      return first.department.localeCompare(second.department);
    }
    return first.name.localeCompare(second.name);
  });
  return sorted;
}

function filterEmployees(list, department, status, search) {
  return list.filter((employee) => {
    const matchesDepartment = department === 'all' || employee.department === department;
    const matchesStatus = status === 'all' || employee.status === status;
    const lowerSearch = search.toLowerCase();
    const matchesSearch = [employee.name, employee.department, employee.designation, employee.employeeId].some((value) => value.toLowerCase().includes(lowerSearch));
    return matchesDepartment && matchesStatus && matchesSearch;
  });
}

function paginateEmployees(list, page, pageSize = 8) {
  const start = (page - 1) * pageSize;
  return {
    items: list.slice(start, start + pageSize),
    pageCount: Math.max(1, Math.ceil(list.length / pageSize)),
    page,
  };
}

function renderPagination(container, pageCount, currentPage, onPageChange) {
  container.innerHTML = '';
  for (let index = 1; index <= pageCount; index += 1) {
    const button = createElement('button', index === currentPage ? 'active' : '');
    button.textContent = String(index);
    button.addEventListener('click', () => onPageChange(index));
    container.append(button);
  }
}

function updateAppState() {
  const settings = getSettings();
  setTheme(settings.theme || 'light');
}

function safeParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function createStatBadge(label, value) {
  const span = createElement('span', 'badge', `${label}: ${value}`);
  return span;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function createListItem(label, value) {
  const row = createElement('div');
  row.innerHTML = `<strong>${label}</strong>: ${value}`;
  return row;
}

function getEmployeeDepartmentOptions(employees) {
  return Array.from(new Set(employees.map((employee) => employee.department))).sort();
}

function getUnreadNotificationsCount() {
  return getNotifications().filter((item) => !item.read).length;
}

function createActionButton(label, testId, onClick) {
  const button = createElement('button', 'btn secondary', label);
  button.dataset.testid = testId;
  button.addEventListener('click', onClick);
  return button;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildAboutContent() {
  return `
    <h2>Northstar Holdings</h2>
    <p>Northstar Holdings operates a modern employee experience platform for distributed teams across finance, engineering, operations, and support.</p>
    <div class="card-grid">
      <article class="stat-card">
        <h3>Portal Version</h3>
        <p>v2.4.0</p>
      </article>
      <article class="stat-card">
        <h3>Technology Stack</h3>
        <p>HTML5, CSS3, Vanilla JavaScript, LocalStorage, JSON</p>
      </article>
      <article class="stat-card">
        <h3>Developer</h3>
        <p>Enterprise Experience Engineering Team</p>
      </article>
      <article class="stat-card">
        <h3>Contact</h3>
        <p>support@northstar.com • +1 415 555 0100</p>
      </article>
    </div>
    <div class="card-grid" style="margin-top:16px">
      <article class="stat-card"><h3>Employees</h3><p>30 Active Records</p></article>
      <article class="stat-card"><h3>Departments</h3><p>8 Functional Areas</p></article>
      <article class="stat-card"><h3>Notifications</h3><p>${getUnreadNotificationsCount()} Unread</p></article>
      <article class="stat-card"><h3>Uptime</h3><p>99.98%</p></article>
    </div>`;
}

function initCommonPage() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      registerPageHooks();
    });
  } else {
    registerPageHooks();
  }
}

initCommonPage();

export {
  STORAGE_KEYS,
  DEFAULT_PROFILE,
  DEFAULT_SETTINGS,
  navItems,
  createElement,
  formatDate,
  formatDateTime,
  getCurrentDate,
  getCurrentTime,
  setAuthSession,
  getAuthSession,
  logoutUser,
  saveProfile,
  getProfile,
  saveSettings,
  getSettings,
  setTheme,
  applyStoredTheme,
  loadJson,
  ensureAuthenticated,
  renderSidebar,
  initLogoutButton,
  registerPageHooks,
  getCurrentPageName,
  attachValidationState,
  debounce,
  createSummaryCard,
  createActivityItem,
  createNotificationItem,
  toggleNotificationRead,
  deleteNotification,
  getNotifications,
  saveNotifications,
  validateEmail,
  validatePhone,
  generateId,
  createEmptyState,
  sortEmployees,
  filterEmployees,
  paginateEmployees,
  renderPagination,
  updateAppState,
  safeParse,
  createStatBadge,
  formatCurrency,
  createListItem,
  getEmployeeDepartmentOptions,
  getUnreadNotificationsCount,
  createActionButton,
  escapeHtml,
  buildAboutContent,
  initCommonPage,
};
