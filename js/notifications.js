import {
  ensureAuthenticated,
  renderSidebar,
  initLogoutButton,
  applyStoredTheme,
  getNotifications,
  saveNotifications,
  createNotificationItem,
  formatDateTime,
} from './common.js';

class NotificationsController {
  constructor() {
    this.notifications = getNotifications();
    this.filter = 'all';
    this.search = '';
    this.init();
  }

  init() {
    if (!ensureAuthenticated()) {
      return;
    }
    applyStoredTheme();
    renderSidebar('notifications.html');
    initLogoutButton();
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    document.getElementById('notificationSearch').addEventListener('input', (event) => {
      this.search = event.target.value.toLowerCase();
      this.render();
    });

    document.getElementById('notificationFilter').addEventListener('change', (event) => {
      this.filter = event.target.value;
      this.render();
    });
  }

  render() {
    const list = document.getElementById('notificationsList');
    const filtered = this.notifications.filter((notification) => {
      const matchesFilter = this.filter === 'all' || (this.filter === 'read' ? notification.read : !notification.read);
      const searchText = `${notification.title} ${notification.message}`.toLowerCase();
      return matchesFilter && searchText.includes(this.search);
    });

    list.innerHTML = '';
    if (!filtered.length) {
      list.append(document.createElement('p').appendChild(document.createTextNode('No notifications match your filters.')));
      return;
    }

    filtered.forEach((notification) => {
      list.append(createNotificationItem(notification));
    });

    const unreadCount = this.notifications.filter((item) => !item.read).length;
    const heading = list.previousElementSibling?.querySelector('h2');
    if (heading) {
      heading.textContent = `Inbox (${unreadCount} unread)`;
    }
  }
}

new NotificationsController();
