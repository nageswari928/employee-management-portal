/**
 * Post-build script to copy dist/index.html to each route HTML filename.
 * This guarantees static servers like GitHub Pages can serve deep SPA routes directly
 * when users refresh the page or bookmark specific pages.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

const routes = [
  'login.html',
  'dashboard.html',
  'employees.html',
  'profile.html',
  'settings.html',
  'notifications.html',
  'about.html'
];

if (!fs.existsSync(indexPath)) {
  console.error(`Error: Built index.html not found at: ${indexPath}`);
  process.exit(1);
}

console.log('Generating route HTML file copies...');

routes.forEach((routeFile) => {
  const destPath = path.join(distDir, routeFile);
  fs.copyFileSync(indexPath, destPath);
  console.log(`- Created ${routeFile}`);
});

console.log('Post-build copies completed successfully!');
