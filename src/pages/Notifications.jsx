import React, { useState } from 'react';
import { useAppContext } from '../App';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Search, MailOpen, Mail, Trash2, BellRing } from 'lucide-react';

export const Notifications = () => {
  const { notifications, toggleNotificationRead, deleteNotification, setLogoutOpen } = useAppContext();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter((item) => !item.read).length;

  const filteredNotifications = notifications.filter((notif) => {
    // Read/Unread filter
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'read' ? notif.read : !notif.read);
    
    // Search text check
    const searchText = `${notif.title} ${notif.message}`.toLowerCase();
    const matchesSearch = searchText.includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background text-foreground font-sans">
      {/* Topbar */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card shadow-sm shrink-0">
        <div>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Inbox</p>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Notifications</h1>
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
        <section className="max-w-4xl mx-auto space-y-4">
          
          {/* Controls card */}
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="p-6 flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <Search className="h-4 w-4" />
                </span>
                <Input
                  id="notificationSearch"
                  data-testid="notification-search"
                  placeholder="Search notifications..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-background border-input text-foreground focus-visible:ring-primary"
                />
              </div>

              {/* Read Status Filter */}
              <div className="w-full sm:w-48">
                <Select
                  id="notificationFilter"
                  data-testid="notification-filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-background border-input text-foreground focus-visible:ring-primary"
                >
                  <option value="all">All Notifications</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Heading with unread count */}
          <div className="flex items-center justify-between px-2 pt-2 border-b border-border/50 pb-2">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <BellRing className="h-4.5 w-4.5 text-primary" /> Inbox ({unreadCount} unread)
            </h2>
            <span className="text-xs font-semibold text-muted-foreground">
              Showing {filteredNotifications.length} items
            </span>
          </div>

          {/* Notifications List Container */}
          <div id="notificationsList" className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => (
                <Card 
                  key={notif.id}
                  className={`border-border bg-card shadow-sm transition-all hover:shadow-md relative overflow-hidden ${
                    !notif.read ? 'border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <strong className="text-sm font-bold text-foreground leading-tight">{notif.title}</strong>
                      <Badge variant="secondary" className="text-[9px] uppercase tracking-wider shrink-0">
                        {notif.category}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/40">
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        {new Date(notif.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </span>

                      <div className="flex gap-2 self-end sm:self-auto">
                        <Button
                          variant="secondary"
                          size="sm"
                          data-testid={`notification-mark-${notif.id}`}
                          onClick={() => toggleNotificationRead(notif.id)}
                          className="h-8 text-xs font-semibold hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                          {notif.read ? (
                            <>
                              <Mail className="h-3.5 w-3.5" /> Mark as Unread
                            </>
                          ) : (
                            <>
                              <MailOpen className="h-3.5 w-3.5" /> Mark as Read
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          data-testid={`notification-delete-${notif.id}`}
                          onClick={() => deleteNotification(notif.id)}
                          className="h-8 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="border border-dashed rounded-xl p-12 text-center text-sm text-muted-foreground bg-muted/10">
                No notifications match your filters.
              </div>
            )}
          </div>

        </section>
      </main>
    </div>
  );
};
