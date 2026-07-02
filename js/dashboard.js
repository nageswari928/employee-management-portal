import {
  ensureAuthenticated,
  createSummaryCard,
  createActivityItem,
  getCurrentDate,
  getCurrentTime,
  getNotifications,
  getUnreadNotificationsCount,
  getProfile,
  getSettings,
  applyStoredTheme,
  createNotificationItem,
  renderSidebar,
  initLogoutButton,
} from './common.js';

class DashboardController {
  constructor() {
    this.profile = getProfile();
    this.settings = getSettings();
    this.init();
  }

  init() {
    if (!ensureAuthenticated()) {
      return;
    }
    applyStoredTheme();
    renderSidebar('dashboard.html');
    initLogoutButton();
    this.renderDashboard();
    this.renderNotificationsPreview();
  }

  renderDashboard() {
    const container = document.getElementById('dashboardContent');
    if (!container) {
      return;
    }
    const cards = [
      createSummaryCard('Total Employees', '30', 'Across 8 departments'),
      createSummaryCard('Departments', '8', 'High-performing teams'),
      createSummaryCard('Pending Requests', '12', 'Awaiting approvals'),
      createSummaryCard('Active Employees', '27', 'Working today'),
    ];
    const overview = document.createElement('div');
    overview.className = 'overview-grid';
    cards.forEach((card) => overview.append(card));

    const hero = document.createElement('section');
    hero.className = 'panel';
    hero.innerHTML = `<div class="form-row"><div><h2>Welcome back, ${this.profile.name}</h2><p>${getCurrentDate()} • ${getCurrentTime()}</p></div><span class="badge">${this.settings.notificationsEnabled ? 'Notifications On' : 'Notifications Off'}</span></div>`;

    const charts = document.createElement('section');
    charts.className = 'panel';
    charts.innerHTML = '<h3>Quarterly Headcount Trend</h3><div class="chart-placeholder">Static chart placeholder</div>';

    const activity = document.createElement('section');
    activity.className = 'panel';
    activity.innerHTML = '<h3>Recent Activities</h3><div class="activity-list"></div>';
    const activityList = activity.querySelector('.activity-list');
    [
      'Updated employee onboarding materials',
      'Approved 4 leave requests',
      'Reviewed new policy acknowledgments',
    ].forEach((item, index) => {
      activityList.append(createActivityItem(item, `2${index} min ago`));
    });

    const notificationPanel = document.createElement('section');
    notificationPanel.className = 'panel';
    notificationPanel.innerHTML = '<h3>Latest Notifications</h3><div class="notification-list"></div>';
    const notificationList = notificationPanel.querySelector('.notification-list');
    getNotifications().slice(0, 3).forEach((item) => notificationList.append(createNotificationItem(item)));

    container.innerHTML = '';
    container.append(hero, overview, charts, activity, notificationPanel);
  }

  renderNotificationsPreview() {
    const element = document.querySelector('[data-testid="notification-btn"]');
    if (element) {
      element.textContent = `🔔 ${getUnreadNotificationsCount()}`;
    }
  }
}

new DashboardController();
