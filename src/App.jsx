import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Employees } from './pages/Employees';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Notifications } from './pages/Notifications';
import { About } from './pages/About';
import { Dialog } from './components/ui/Dialog';
import { Button } from './components/ui/Button';

// Keys & Constants
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

// Create Context
const AppContext = createContext(null);

export const useAppContext = () => useContext(AppContext);

// Layout wrapper for authenticated pages
const AppLayout = ({ children }) => {
  const { auth, employees, logout, logoutOpen, setLogoutOpen } = useAppContext();
  const location = useLocation();

  const isValidUser = auth && employees.some(emp => emp.employeeId === auth.userId);

  React.useEffect(() => {
    if (auth && !isValidUser) {
      logout();
    }
  }, [auth, isValidUser, logout]);

  if (!auth || !isValidUser) {
    return <Navigate to="/login.html" replace />;
  }

  return (
    <div className="flex bg-background text-foreground min-h-screen">
      <Sidebar />
      
      {/* Dynamic Content Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>

      {/* Global Logout Modal */}
      <Dialog 
        open={logoutOpen} 
        onClose={() => setLogoutOpen(false)} 
        title="Confirm Logout"
        id="logoutModal"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Are you sure you want to leave the portal?</p>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              id="confirmLogoutBtn"
              data-testid="confirm-logout"
              onClick={logout}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
            >
              Yes
            </Button>
            <Button
              id="cancelLogoutBtn"
              data-testid="cancel-logout"
              variant="outline"
              onClick={() => setLogoutOpen(false)}
              className="border-border text-foreground hover:bg-muted"
            >
              No
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default function App() {
  // Authentication session
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.auth);
    return raw ? JSON.parse(raw) : null;
  });

  // User Profile
  const [profile, setProfileState] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.profile);
    return raw ? JSON.parse(raw) : DEFAULT_PROFILE;
  });

  // System Settings
  const [settings, setSettingsState] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.settings);
    return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
  });

  // Database lists
  const [employees, setEmployees] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);

  // Sync settings theme to document element class
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Load Seed Data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load employees
        const storedEmployees = localStorage.getItem(STORAGE_KEYS.employees);
        if (storedEmployees) {
          setEmployees(JSON.parse(storedEmployees));
        } else {
          const response = await fetch('/data/employees.json');
          const data = await response.json();
          // Ensure all have correct relative ID
          const parsed = data.map((emp, index) => ({
            ...emp,
            id: emp.employeeId || `EMP${String(index + 1).padStart(3, '0')}`
          }));
          setEmployees(parsed);
          localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(parsed));
        }

        // Load notifications
        const storedNotifications = localStorage.getItem(STORAGE_KEYS.notifications);
        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications));
        } else {
          const response = await fetch('/data/notifications.json');
          const data = await response.json();
          setNotifications(data);
          localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(data));
        }
      } catch (err) {
        console.error('Failed to load portal seed data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Authentication Handlers
  const login = (userId, rememberMe) => {
    const session = {
      userId,
      rememberMe,
      loginTime: new Date().toISOString()
    };
    setAuth(session);
    localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(session));
    
    // Save rememberMe in settings
    const updatedSettings = { ...settings, rememberMe };
    setSettingsState(updatedSettings);
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(updatedSettings));
  };

  const logout = () => {
    setAuth(null);
    setLogoutOpen(false);
    localStorage.removeItem(STORAGE_KEYS.auth);
  };

  // State Mutators
  const updateProfile = (updatedProfile) => {
    setProfileState(updatedProfile);
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(updatedProfile));
  };

  const updateSettings = (updatedSettings) => {
    const merged = { ...settings, ...updatedSettings };
    setSettingsState(merged);
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(merged));
  };

  const resetSettings = () => {
    setSettingsState(DEFAULT_SETTINGS);
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(DEFAULT_SETTINGS));
  };

  const toggleNotificationRead = (id) => {
    const updated = notifications.map((notif) =>
      notif.id === id ? { ...notif, read: !notif.read } : notif
    );
    setNotifications(updated);
    localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(updated));
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter((notif) => notif.id !== id);
    setNotifications(updated);
    localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white font-sans">
        <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xl animate-bounce">
          EP
        </div>
        <p className="mt-4 text-xs font-semibold tracking-wider text-slate-400 uppercase animate-pulse">
          Loading portal context...
        </p>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        auth,
        profile,
        settings,
        employees,
        notifications,
        logoutOpen,
        setLogoutOpen,
        login,
        logout,
        updateProfile,
        updateSettings,
        resetSettings,
        toggleNotificationRead,
        deleteNotification
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login.html" element={<Login />} />

          {/* Authenticated Layout Routes */}
          <Route path="/dashboard.html" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/employees.html" element={<AppLayout><Employees /></AppLayout>} />
          <Route path="/profile.html" element={<AppLayout><Profile /></AppLayout>} />
          <Route path="/settings.html" element={<AppLayout><Settings /></AppLayout>} />
          <Route path="/notifications.html" element={<AppLayout><Notifications /></AppLayout>} />
          <Route path="/about.html" element={<AppLayout><About /></AppLayout>} />

          {/* Default fallbacks */}
          <Route path="/" element={<Navigate to={auth ? "/dashboard.html" : "/login.html"} replace />} />
          <Route path="*" element={<Navigate to={auth ? "/dashboard.html" : "/login.html"} replace />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
