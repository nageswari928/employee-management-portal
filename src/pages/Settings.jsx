import React, { useState } from 'react';
import { useAppContext } from '../App';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Switch } from '../components/ui/Switch';
import { Button } from '../components/ui/Button';
import { Settings as SettingsIcon, ShieldAlert, Sliders, Save, RotateCcw } from 'lucide-react';

export const Settings = () => {
  const { settings, updateSettings, resetSettings, setLogoutOpen } = useAppContext();

  const [theme, setTheme] = useState(settings.theme || 'light');
  const [language, setLanguage] = useState(settings.language || 'en');
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    settings.notificationsEnabled !== false
  );
  const [autoLogoutEnabled, setAutoLogoutEnabled] = useState(
    settings.autoLogoutEnabled !== false
  );

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleReset = () => {
    resetSettings();
    setTheme('light');
    setLanguage('en');
    setNotificationsEnabled(true);
    setAutoLogoutEnabled(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMessageType('success');
    setMessage('Settings reset to defaults.');
  };

  const handleSave = (e) => {
    e.preventDefault();
    setMessage('');

    const errors = [];
    if (newPassword) {
      if (newPassword.length < 6) {
        errors.push('New password must be at least 6 characters.');
      }
      if (newPassword !== confirmPassword) {
        errors.push('Passwords do not match.');
      }
    }

    if (errors.length > 0) {
      setMessageType('error');
      setMessage(errors.join(' '));
      return;
    }

    const updated = {
      theme,
      language,
      notificationsEnabled,
      autoLogoutEnabled,
      ...(newPassword ? { newPassword } : {})
    };

    updateSettings(updated);
    setMessageType('success');
    setMessage('Settings saved successfully.');
    
    // Clear password fields on success
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background text-foreground font-sans">
      {/* Topbar */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card shadow-sm shrink-0">
        <div>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Configuration</p>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Settings</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setLogoutOpen(true)}
            data-testid="logout-btn"
            className="border-border text-foreground hover:bg-muted"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        <section className="max-w-4xl mx-auto">
          <form id="settingsForm" onSubmit={handleSave} className="space-y-6" noValidate>
            
            {/* Preferences Card */}
            <Card className="border-border bg-card shadow-sm">
              <CardHeader className="border-b border-border pb-4 flex flex-row items-center gap-3">
                <Sliders className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-base font-bold text-foreground">Preferences</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Customize your portal experience.</p>
                </div>
              </CardHeader>
              <CardContent className="p-6 divide-y divide-border space-y-4">
                
                {/* Theme Selection */}
                <div className="flex items-center justify-between py-2 gap-4">
                  <label htmlFor="themeToggle" className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-foreground">Theme</span>
                    <span className="text-xs text-muted-foreground">Select light or dark mode.</span>
                  </label>
                  <Select
                    id="themeToggle"
                    data-testid="theme-toggle"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-40 bg-background border-input text-foreground focus-visible:ring-primary"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </Select>
                </div>

                {/* Language Selection */}
                <div className="flex items-center justify-between pt-4 pb-2 gap-4">
                  <label htmlFor="languageSelect" className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-foreground">Language</span>
                    <span className="text-xs text-muted-foreground">Select preferred portal language.</span>
                  </label>
                  <Select
                    id="languageSelect"
                    data-testid="language-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-40 bg-background border-input text-foreground focus-visible:ring-primary"
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </Select>
                </div>

                {/* Notifications Switch */}
                <div className="flex items-center justify-between pt-4 pb-2 gap-4">
                  <label htmlFor="notificationToggle" className="flex flex-col gap-0.5 cursor-pointer">
                    <span className="text-sm font-semibold text-foreground">Notifications</span>
                    <span className="text-xs text-muted-foreground">Enable system notification triggers.</span>
                  </label>
                  <Switch
                    id="notificationToggle"
                    data-testid="notification-toggle"
                    checked={notificationsEnabled}
                    onChange={setNotificationsEnabled}
                  />
                </div>

                {/* Auto Logout Switch */}
                <div className="flex items-center justify-between pt-4 pb-2 gap-4">
                  <label htmlFor="autoLogoutToggle" className="flex flex-col gap-0.5 cursor-pointer">
                    <span className="text-sm font-semibold text-foreground">Auto Logout</span>
                    <span className="text-xs text-muted-foreground">Log out automatically after periods of inactivity.</span>
                  </label>
                  <Switch
                    id="autoLogoutToggle"
                    data-testid="auto-logout-toggle"
                    checked={autoLogoutEnabled}
                    onChange={setAutoLogoutEnabled}
                  />
                </div>

              </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card className="border-border bg-card shadow-sm">
              <CardHeader className="border-b border-border pb-4 flex flex-row items-center gap-3">
                <ShieldAlert className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-base font-bold text-foreground">Change Password</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Secure your employee portal credentials.</p>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Current Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground" htmlFor="currentPassword">
                      Current Password
                    </label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      data-testid="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-background border-input text-foreground focus-visible:ring-primary"
                    />
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground" htmlFor="newPassword">
                      New Password
                    </label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      data-testid="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-background border-input text-foreground focus-visible:ring-primary"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      data-testid="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-background border-input text-foreground focus-visible:ring-primary"
                    />
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Actions & Messages Row */}
            <div className="space-y-4">
              {/* Settings message block */}
              {message && (
                <div 
                  id="settingsMessage" 
                  className={`p-3 rounded-lg text-xs font-semibold border text-center transition-all ${
                    messageType === 'error' 
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-450' 
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-450'
                  }`}
                  role="alert"
                  aria-live="polite"
                >
                  {message}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  id="saveSettingsBtn"
                  type="submit"
                  data-testid="save-settings-btn"
                  className="bg-primary text-primary-foreground font-semibold flex items-center gap-2"
                >
                  <Save className="h-4 w-4" /> Save Settings
                </Button>
                
                <Button
                  id="resetSettingsBtn"
                  type="button"
                  data-testid="reset-settings-btn"
                  variant="outline"
                  onClick={handleReset}
                  className="border-border text-foreground hover:bg-muted flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" /> Reset Settings
                </Button>
              </div>
            </div>

          </form>
        </section>
      </main>
    </div>
  );
};
