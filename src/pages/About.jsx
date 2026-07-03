import React from 'react';
import { useAppContext } from '../App';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ShieldCheck, Cpu, Code2, Users, Building, Mail, Sparkles } from 'lucide-react';

export const About = () => {
  const { notifications, setLogoutOpen } = useAppContext();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background text-foreground font-sans">
      {/* Topbar */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card shadow-sm shrink-0">
        <div>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">About</p>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Portal Info</h1>
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
        <section className="max-w-4xl mx-auto space-y-6">
          
          {/* Welcome Panel */}
          <Card className="border-border bg-card shadow-sm relative overflow-hidden">
            {/* Background highlight */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-600/10 to-indigo-600/5 rounded-full filter blur-2xl pointer-events-none" />
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Sparkles className="h-4 w-4" /> System Overview
              </div>
              <CardTitle className="text-xl font-bold mt-1">Northstar Holdings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Northstar Holdings operates a modern employee experience platform for distributed teams across finance, engineering, operations, and support. This portal serves as the primary gateway for employee directories, profile management, and notification services.
              </p>
            </CardContent>
          </Card>

          {/* Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Portal Version */}
            <Card className="border-border bg-card shadow-sm">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Portal Version</span>
                  <p className="font-semibold text-foreground text-sm">v2.4.0 (React Migration)</p>
                </div>
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card className="border-border bg-card shadow-sm">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">
                  <Code2 className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Technology Stack</span>
                  <p className="font-semibold text-foreground text-sm leading-relaxed">
                    React 18, Vite 5, Tailwind CSS, Lucide Icons, LocalStorage
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Developer */}
            <Card className="border-border bg-card shadow-sm">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0">
                  <Cpu className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Developer Team</span>
                  <p className="font-semibold text-foreground text-sm">Enterprise Experience Engineering</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-border bg-card shadow-sm">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Contact Info</span>
                  <p className="font-semibold text-foreground text-sm leading-relaxed">
                    support@northstar.com • +1 415 555 0100
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Portal Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Total Employees */}
            <Card className="border-border bg-card shadow-sm text-center">
              <CardContent className="p-5 space-y-1">
                <Users className="h-5 w-5 mx-auto text-blue-500 mb-1" />
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Employees</span>
                <p className="font-extrabold text-foreground text-base">30 Active</p>
              </CardContent>
            </Card>

            {/* Departments */}
            <Card className="border-border bg-card shadow-sm text-center">
              <CardContent className="p-5 space-y-1">
                <Building className="h-5 w-5 mx-auto text-emerald-500 mb-1" />
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Departments</span>
                <p className="font-extrabold text-foreground text-base">8 Areas</p>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-border bg-card shadow-sm text-center">
              <CardContent className="p-5 space-y-1">
                <BellRing className="h-5 w-5 mx-auto text-amber-500 mb-1" />
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Inbox</span>
                <p className="font-extrabold text-foreground text-base">{unreadCount} Unread</p>
              </CardContent>
            </Card>

            {/* Uptime */}
            <Card className="border-border bg-card shadow-sm text-center">
              <CardContent className="p-5 space-y-1">
                <ShieldCheck className="h-5 w-5 mx-auto text-indigo-500 mb-1" />
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Uptime</span>
                <p className="font-extrabold text-foreground text-base">99.98%</p>
              </CardContent>
            </Card>

          </div>

        </section>
      </main>
    </div>
  );
};
