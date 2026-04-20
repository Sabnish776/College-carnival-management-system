import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, LogOut, Calendar, Ticket, Bell, LayoutDashboard, Search, Filter, Loader2, User, Megaphone, Menu, X } from 'lucide-react';
import { Button, EventCard, AnnouncementCard, ProshowCard, ScheduleTimeline, TimelineItem } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Event } from '../types/event';
import { Announcement } from '../types/announcement';
import { Registration } from '../types/registration';
import { Proshow, ProshowRegistration } from '../types/proshow';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

type Tab = 'events' | 'schedule' | 'proshow' | 'announcements';

export const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('events');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [proshows, setProshows] = useState<Proshow[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [proshowRegistrations, setProshowRegistrations] = useState<ProshowRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRegistrations();
    fetchProshowRegistrations();
  }, []);

  useEffect(() => {
    if (activeTab === 'events') {
      fetchEvents();
    } else if (activeTab === 'announcements') {
      fetchAnnouncements();
    } else if (activeTab === 'proshow') {
      fetchProshows();
    } else if (activeTab === 'schedule') {
      fetchEvents();
      fetchProshows();
    }
  }, [activeTab]);

  const fetchRegistrations = async () => {
    try {
      const data = await api.get('/api/registrations/me');
      setRegistrations(data.registrations || []);
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    }
  };

  const fetchProshowRegistrations = async () => {
    try {
      const data = await api.get('/api/proshows/me');
      setProshowRegistrations(data.registrations || []);
    } catch (error) {
      console.error('Failed to fetch proshow registrations:', error);
    }
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/api/events');
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/api/announcements');
      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProshows = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/api/proshows');
      setProshows(data.proshows || []);
    } catch (error) {
      console.error('Failed to fetch proshows:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      await api.post(`/api/registrations/${eventId}`, {});
      toast.success('Registration successful');
      fetchRegistrations();
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const handleProshowRegister = async (proshowId: string) => {
    try {
      await api.post(`/api/proshows/${proshowId}/register`, {});
      toast.success('Registration successful');
      fetchProshowRegistrations();
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const isEventRegistered = (eventId: string) => {
    return registrations.some(reg => reg.eventId === eventId);
  };

  const isProshowRegistered = (proshowId: string) => {
    return proshowRegistrations.some(reg => reg.proshowId === proshowId);
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const timelineItems = useMemo<TimelineItem[]>(() => {
    const items: TimelineItem[] = [];
    events.forEach(event => {
      items.push({
        id: event.id.toString(),
        type: 'event',
        title: event.title,
        description: event.description,
        date: new Date(event.eventDateTime),
        venue: event.venue,
        categoryOrArtist: event.category
      });
    });
    proshows.forEach(proshow => {
      items.push({
        id: proshow.id,
        type: 'proshow',
        title: proshow.title,
        description: proshow.description,
        date: new Date(proshow.dateTime),
        venue: proshow.venue,
        categoryOrArtist: proshow.artist
      });
    });
    return items.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [events, proshows]);

  const navItems = [
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'schedule', label: 'Schedule', icon: LayoutDashboard },
    { id: 'proshow', label: 'Pro-Show', icon: Ticket },
    { id: 'announcements', label: 'Announcements', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-background fest-pattern font-sans flex relative overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#080808] border-r border-white/5 flex flex-col transition-transform duration-300 md:translate-x-0 shadow-[4px_0_24px_rgba(0,0,0,0.5)] md:shadow-none",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo Area */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-[#A67C00] rounded-xl flex items-center justify-center text-background shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              <GraduationCap size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold font-serif text-text-primary leading-none tracking-wider text-gradient-gold">C C M S</h1>
              <p className="text-primary/70 text-[10px] uppercase tracking-[0.2em] font-bold mt-1">Student Portal</p>
            </div>
          </div>
          <button className="md:hidden text-text-secondary" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as Tab);
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm transition-all duration-300 relative group overflow-hidden font-medium",
                activeTab === item.id 
                  ? "text-primary bg-primary/10" 
                  : "text-text-secondary hover:text-white"
              )}
            >
              {activeTab === item.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(212,175,55,0.8)] rounded-r-md"></div>
              )}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <item.icon size={18} className={cn("relative z-10 transition-colors", activeTab === item.id ? "text-primary" : "text-text-secondary group-hover:text-primary-light")} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom Profile Area */}
        <div className="p-4 border-t border-white/5 bg-[#080808]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div className="flex-1 overflow-hidden cursor-pointer" onClick={() => navigate('/profile')}>
              <p className="text-sm font-bold text-text-primary truncate hover:text-primary transition-colors">{user?.name}</p>
              <p className="text-xs text-text-secondary truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-accent hover:bg-accent/10 border border-transparent hover:border-accent/20 transition-all"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full md:w-[calc(100%-16rem)]">
        {/* Top Navbar */}
        <header className="h-16 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-text-primary p-2 -ml-2 rounded-lg hover:bg-white/5"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h2 className="text-2xl font-bold font-serif text-text-primary capitalize hidden sm:block tracking-wide">
              {activeTab}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
              <input 
                type="text" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0a0a0a] border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 w-64 transition-all text-white placeholder:text-text-secondary/50"
              />
            </div>
            <button className="p-2 text-text-secondary hover:text-secondary transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-accent rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto pb-20">
            <AnimatePresence mode="wait">
              {activeTab === 'events' && (
                <motion.div
                  key="events"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <h2 className="text-4xl font-bold font-serif text-text-primary tracking-wide text-gradient-gold">UPCOMING EVENTS</h2>
                      <p className="text-sm text-text-secondary mt-2 font-light">Explore and register for exciting cultural activities.</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <div className="relative flex-1 sm:hidden">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                        <input 
                          type="text" 
                          placeholder="Search events..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary text-white"
                        />
                      </div>
                      <Button variant="secondary" className="rounded-lg p-2.5">
                        <Filter size={18} />
                      </Button>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-20 text-text-secondary">
                      <Loader2 className="animate-spin" size={32} />
                    </div>
                  ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredEvents.map((event) => (
                        <EventCard 
                          key={event.id} 
                          event={event} 
                          isRegistered={isEventRegistered(event.id)}
                          onRegister={handleRegister}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="glass-panel py-20 text-center">
                      <Calendar size={48} className="mx-auto text-border-soft mb-4" />
                      <h3 className="text-lg font-bold text-text-primary">No events found</h3>
                      <p className="text-text-secondary mt-1">Check back later for new events.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'announcements' && (
                <motion.div
                  key="announcements"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="mb-8">
                    <h2 className="text-4xl font-bold font-serif text-text-primary tracking-wide">ANNOUNCEMENTS</h2>
                    <p className="text-sm text-text-secondary mt-2 font-light">Stay updated with the latest news.</p>
                  </div>

                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
                      <Loader2 className="animate-spin mb-4" size={32} />
                    </div>
                  ) : announcements.length > 0 ? (
                    <div className="space-y-4 max-w-3xl">
                      {announcements.map((announcement) => (
                        <AnnouncementCard key={announcement.id} announcement={announcement} />
                      ))}
                    </div>
                  ) : (
                    <div className="glass-panel py-20 text-center max-w-3xl">
                      <Megaphone size={48} className="mx-auto text-border-soft mb-4" />
                      <h3 className="text-lg font-bold text-text-primary">No announcements</h3>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'proshow' && (
                <motion.div
                  key="proshow"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="mb-8">
                    <h2 className="text-4xl font-bold font-serif text-text-primary tracking-wide text-gradient-gold">PRO-SHOWS</h2>
                    <p className="text-sm text-text-secondary mt-2 font-light">Get your passes for the biggest performances.</p>
                  </div>

                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
                      <Loader2 className="animate-spin mb-4" size={32} />
                    </div>
                  ) : proshows.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {proshows.map((proshow) => (
                        <ProshowCard 
                          key={proshow.id} 
                          proshow={proshow} 
                          isRegistered={isProshowRegistered(proshow.id)}
                          onRegister={handleProshowRegister}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="glass-panel py-20 text-center">
                      <Ticket size={48} className="mx-auto text-border-soft mb-4" />
                      <h3 className="text-lg font-bold text-text-primary">No pro-shows listed</h3>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'schedule' && (
                <motion.div
                  key="schedule"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 max-w-3xl mx-auto"
                >
                  <div className="mb-8">
                    <h2 className="text-4xl font-bold font-serif text-text-primary tracking-wide">YOUR TIMELINE</h2>
                    <p className="text-text-secondary mt-2 font-light">A chronological timeline of registered events.</p>
                  </div>

                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
                      <Loader2 className="animate-spin mb-4" size={32} />
                    </div>
                  ) : (
                    <ScheduleTimeline items={timelineItems} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};
