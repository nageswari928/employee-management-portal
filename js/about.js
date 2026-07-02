import { ensureAuthenticated, renderSidebar, initLogoutButton, applyStoredTheme, buildAboutContent } from './common.js';

class AboutController {
  constructor() {
    this.init();
  }

  init() {
    if (!ensureAuthenticated()) {
      return;
    }
    applyStoredTheme();
    renderSidebar('about.html');
    initLogoutButton();
    const container = document.getElementById('aboutContent');
    if (container) {
      container.innerHTML = buildAboutContent();
    }
  }
}

new AboutController();
