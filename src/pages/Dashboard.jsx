import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../App';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Bell, Users, BarChart3, Clock, AlertCircle } from 'lucide-react';

export const Dashboard = () => {
  const { 
    profile, 
    settings, 
    notifications, 
    setLogoutOpen, 
    toggleNotificationRead, 
    deleteNotification 
  } = useAppContext();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read);
  const latestNotifications = notifications.slice(0, 3);

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  const stats = [
    { title: 'Total Employees', value: '30', desc: 'Across 8 departments', icon: Users, color: 'text-blue-500 bg-blue-500/10' },
    { title: 'Departments', value: '8', desc: 'High-performing teams', icon: BarChart3, color: 'text-emerald-500 bg-emerald-500/10' },
    { title: 'Pending Requests', value: '12', desc: 'Awaiting approvals', icon: AlertCircle, color: 'text-amber-500 bg-amber-500/10' },
    { title: 'Active Employees', value: '27', desc: 'Working today', icon: Clock, color: 'text-indigo-500 bg-indigo-500/10' }
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background text-foreground font-sans">
      {/* Topbar */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card shadow-sm shrink-0">
        <div>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Operations Center</p>
          <h1 data-testid="dashboard" className="text-xl font-bold tracking-tight text-foreground">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/notifications.html" 
            className="relative p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            data-testid="notification-btn"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold h-5 min-w-5 px-1 rounded-full flex items-center justify-center border-2 border-card">
                {unreadNotifications.length}
              </span>
            )}
          </Link>
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
        {/* Welcome Section */}
        <section className="bg-gradient-to-r from-blue-600/10 to-indigo-600/5 border border-blue-500/15 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-foreground">Welcome back, {profile.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {formattedDate} • {formattedTime}
            </p>
          </div>
          <Badge variant={settings.notificationsEnabled ? 'success' : 'secondary'} className="self-start md:self-auto py-1 px-3">
            {settings.notificationsEnabled ? 'Notifications On' : 'Notifications Off'}
          </Badge>
        </section>

        {/* Overview Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} data-testid="dashboard-card" className="border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6 flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">{stat.title}</p>
                    <p className="text-3xl font-extrabold tracking-tight text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground font-medium">{stat.desc}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Charts & Lists Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quarterly Headcount Trend Chart */}
          <Card className="lg:col-span-2 border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">Quarterly Headcount Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex flex-col justify-end pt-4">
              {/* Modern CSS chart representation */}
              <div className="flex-1 flex items-end justify-between gap-6 px-4 pb-2">
                {[
                  { label: 'Q1 2025', count: 18, pct: '45%' },
                  { label: 'Q2 2025', count: 22, pct: '55%' },
                  { label: 'Q3 2025', count: 25, pct: '62%' },
                  { label: 'Q4 2025', count: 26, pct: '65%' },
                  { label: 'Q1 2026', count: 28, pct: '70%' },
                  { label: 'Q2 2026', count: 30, pct: '75%' }
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                    <span className="text-[10px] font-bold text-muted-foreground">{item.count}</span>
                    <div 
                      style={{ height: item.pct }} 
                      className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-sm hover:opacity-90 transition-opacity cursor-pointer shadow-sm min-h-[10px]"
                    />
                    <span className="text-[10px] text-muted-foreground font-semibold whitespace-nowrap">{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'Updated employee onboarding materials', time: '20 min ago' },
                { title: 'Approved 4 leave requests', time: '21 min ago' },
                { title: 'Reviewed new policy acknowledgments', time: '22 min ago' }
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground leading-snug">{activity.title}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Latest Notifications Section */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">Latest Notifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestNotifications.length > 0 ? (
              latestNotifications.map((notif) => (
                <Card 
                  key={notif.id} 
                  className={`border-border bg-card shadow-sm relative overflow-hidden transition-all hover:shadow-md ${
                    !notif.read ? 'border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <strong className="text-sm font-bold text-foreground leading-tight line-clamp-1">{notif.title}</strong>
                      <Badge variant="secondary" className="shrink-0 text-[9px] uppercase tracking-wider">
                        {notif.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed h-8">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {new Date(notif.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex gap-1.5">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-[10px] hover:bg-muted font-bold"
                          data-testid={`notification-mark-${notif.id}`}
                          onClick={() => toggleNotificationRead(notif.id)}
                        >
                          {notif.read ? 'Mark as Unread' : 'Mark as Read'}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-[10px] hover:bg-destructive/10 text-destructive hover:text-destructive font-bold"
                          data-testid={`notification-delete-${notif.id}`}
                          onClick={() => deleteNotification(notif.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 border border-dashed rounded-xl p-8 text-center text-sm text-muted-foreground bg-muted/10">
                No notifications found.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
