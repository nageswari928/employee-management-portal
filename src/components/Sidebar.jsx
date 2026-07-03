import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, User, Settings, Bell, Info } from 'lucide-react';
import { useAppContext } from '../App';

export const Sidebar = () => {
  const { notifications } = useAppContext();
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { label: 'Dashboard', page: '/dashboard.html', icon: LayoutDashboard, testId: 'nav-dashboard' },
    { label: 'Employees', page: '/employees.html', icon: Users, testId: 'nav-employees' },
    { label: 'Profile', page: '/profile.html', icon: User, testId: 'nav-profile' },
    { label: 'Settings', page: '/settings.html', icon: Settings, testId: 'nav-settings' },
    { label: 'Notifications', page: '/notifications.html', icon: Bell, testId: 'nav-notifications', badge: unreadCount },
    { label: 'About', page: '/about.html', icon: Info, testId: 'nav-about' },
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 text-zinc-300 flex flex-col min-h-screen shrink-0 font-sans">
      {/* Brand logo */}
      <div className="flex items-center gap-3 p-6 border-b border-zinc-800">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
          EP
        </div>
        <div>
          <h2 className="font-bold text-zinc-50 leading-tight text-base">Northstar</h2>
          <p className="text-xs text-zinc-500 font-medium">Employee Portal</p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.page}
              to={item.page}
              data-testid={item.testId}
              id={item.testId}
              className={({ isActive }) => 
                `flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-all group duration-150 ${
                  isActive 
                    ? 'bg-zinc-800 text-zinc-50 shadow-sm border border-zinc-700' 
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4.5 w-4.5 transition-transform duration-150 group-hover:scale-105" />
                <span>{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4 text-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800 text-center text-xs text-zinc-600">
        v2.4.0 • Enterprise Edition
      </div>
    </aside>
  );
};
