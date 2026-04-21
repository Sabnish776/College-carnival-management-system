import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, LogOut, Users, Settings, BarChart3, PlusCircle, Calendar, Search, Filter, Loader2, Trash2, Edit3, User, Megaphone, Send, LayoutDashboard, Menu, X, Bell } from 'lucide-react';
import { Button, EventCard, EventForm, AnnouncementCard, AnnouncementForm, ProshowCard, ProshowForm } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Event } from '../types/event';
import { Announcement } from '../types/announcement';
import { Proshow } from '../types/proshow';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

type AdminTab = 'overview' | 'events' | 'proshows' | 'announcements';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [proshows, setProshows] = useState<Proshow[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAnnouncementFormOpen, setIsAnnouncementFormOpen] = useState(false);
  const [isProshowFormOpen, setIsProshowFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingProshow, setEditingProshow] = useState<Proshow | null>(null);

  useEffect(() => {
    fetchEvents();
    fetchProshows();
    fetchAnnouncements();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/api/events');
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to load events');
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
      toast.error('Failed to load proshows');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const data = await api.get('/api/announcements');
      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  };

  const handleCreateAnnouncement = async (data: { title: string; description: string }) => {
    try {
      await api.post('/api/admin/announcements', data);
      toast.success('Announcement made successfully');
      fetchAnnouncements();
    } catch (error: any) {
      toast.error(error.message || 'Failed to post announcement');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await api.delete(`/api/admin/announcements/${id}`);
      toast.success('Announcement deleted successfully');
      fetchAnnouncements();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete announcement');
    }
  };

  const handleCreateEvent = async (data: any) => {
    try {
      await api.post('/api/admin/events', data);
      toast.success('Event created successfully');
      setIsFormOpen(false);
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create event');
    }
  };

  const handleUpdateEvent = async (data: any) => {
    if (!editingEvent) return;
    try {
      await api.put(`/api/admin/events/${editingEvent.id}`, data);
      toast.success('Event updated successfully');
      setEditingEvent(null);
      setIsFormOpen(false);
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update event');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/api/admin/events/${id}`);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete event');
    }
  };

  const handleCreateProshow = async (data: any) => {
    try {
      await api.post('/api/admin/proshows', data);
      toast.success('Proshow created successfully');
      setIsProshowFormOpen(false);
      fetchProshows();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create proshow');
    }
  };

  const handleUpdateProshow = async (data: any) => {
    if (!editingProshow) return;
    try {
      await api.put(`/api/admin/proshows/${editingProshow.id}`, data);
      toast.success('Proshow updated successfully');
      setEditingProshow(null);
      setIsProshowFormOpen(false);
      fetchProshows();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update proshow');
    }
  };

  const handleDeleteProshow = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this proshow?')) return;
    try {
      await api.delete(`/api/admin/proshows/${id}`);
      toast.success('Proshow deleted successfully');
      fetchProshows();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete proshow');
    }
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'proshows', label: 'Pro-Shows', icon: Calendar }, // Could import Ticket instead
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
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
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-[50px] rounded-full pointer-events-none"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-[#4A1D96] rounded-xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(109,40,217,0.4)]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold font-serif text-text-primary leading-none tracking-wider text-gradient-gold">C C M S</h1>
              <p className="text-secondary/70 text-[10px] uppercase tracking-[0.2em] font-bold mt-1">Admin Portal</p>
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
                setActiveTab(item.id as AdminTab);
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm transition-all duration-300 relative group overflow-hidden font-medium",
                activeTab === item.id 
                  ? "text-secondary bg-secondary/10" 
                  : "text-text-secondary hover:text-white"
              )}
            >
              {activeTab === item.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary shadow-[0_0_10px_rgba(109,40,217,0.8)] rounded-r-md"></div>
              )}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <item.icon size={18} className={cn("relative z-10 transition-colors", activeTab === item.id ? "text-secondary" : "text-text-secondary group-hover:text-secondary/70")} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom Profile Area */}
        <div className="p-4 border-t border-white/5 bg-[#080808]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full border border-secondary/30 bg-secondary/10 flex items-center justify-center text-secondary font-bold shadow-inner">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-text-primary truncate">{user?.name}</p>
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
              {activeTab.replace('-', ' ')}
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
                  className="bg-[#0a0a0a] border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 w-64 transition-all text-white"
                />
            </div>
            <button className="p-2 text-text-secondary hover:text-primary transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-accent rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto pb-20">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {[
                      { label: 'Total Events', value: events.length.toString(), icon: Calendar, color: 'text-primary' },
                      { label: 'Registrations', value: '1,284', icon: Users, color: 'text-emerald-600' },
                      { label: 'Tickets Sold', value: '850', icon: BarChart3, color: 'text-secondary' },
                      { label: 'System Status', value: 'Active', icon: Settings, color: 'text-accent' },
                    ].map((stat, i) => (
                      <div key={i} className="glass-card bg-[#050505] p-6 flex flex-col justify-between hover:shadow-[0_0_25px_rgba(255,255,255,0.05)] transition-shadow border border-white/5">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-xl bg-surface border border-white/10 ${stat.color} shadow-inner`}>
                            <stat.icon size={22} />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-4xl font-bold font-serif text-text-primary">{stat.value}</h3>
                          <p className="text-sm font-medium text-text-secondary/70 mt-1 uppercase tracking-[0.1em]">{stat.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Welcome Hero */}
                  <div className="glass-card p-8 sm:p-12 relative overflow-hidden bg-[#111111] border border-white/10 shadow-[0_0_40px_rgba(109,40,217,0.15)]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-[80px] -mr-32 -mt-32 mix-blend-screen pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -ml-32 -mb-32 mix-blend-screen pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-6 border border-secondary/20 shadow-inner">
                        <ShieldCheck size={40} />
                      </div>
                      <h2 className="text-4xl sm:text-5xl font-bold font-serif text-text-primary mb-4 tracking-wide text-gradient-gold">CONTROL CENTER</h2>
                      <p className="text-text-secondary/80 max-w-xl mx-auto text-lg font-light">
                        Manage events, broadcast announcements, and monitor carnival registrations from this unified dashboard.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

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
                      <h2 className="text-4xl font-bold font-serif text-text-primary tracking-wide text-gradient-gold">EVENT MANAGEMENT</h2>
                      <p className="text-sm text-text-secondary mt-2 font-light">Create and manage your carnival events.</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <div className="relative flex-1 sm:hidden">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                        <input 
                          type="text" 
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-surface border border-border-soft rounded-lg py-2 pl-9 pr-4 text-sm"
                        />
                      </div>
                      <Button 
                        className="bg-primary hover:bg-primary-dark text-white rounded-lg px-4 py-2 shrink-0"
                        onClick={() => { setEditingEvent(null); setIsFormOpen(true); }}
                      >
                        <PlusCircle size={18} className="mr-2" />
                        New Event
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
                          isAdmin={true}
                          onEdit={(ev) => { setEditingEvent(ev); setIsFormOpen(true); }}
                          onDelete={handleDeleteEvent}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="glass-panel py-20 text-center">
                      <Calendar size={48} className="mx-auto text-border-soft mb-4" />
                      <h3 className="text-lg font-bold text-text-primary">No events found</h3>
                      <p className="text-text-secondary mt-1">Start by creating your first event.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'proshows' && (
                <motion.div
                  key="proshows"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <h2 className="text-4xl font-bold font-serif text-text-primary tracking-wide text-gradient-gold">PRO-SHOW MANAGEMENT</h2>
                      <p className="text-sm text-text-secondary mt-2 font-light">Manage headline artists and ticketed shows.</p>
                    </div>
                    <Button 
                      className="bg-primary hover:bg-primary-dark text-white rounded-lg px-4 py-2 w-full sm:w-auto"
                      onClick={() => { setEditingProshow(null); setIsProshowFormOpen(true); }}
                    >
                      <PlusCircle size={18} className="mr-2" />
                      New Pro-Show
                    </Button>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-20 text-text-secondary">
                      <Loader2 className="animate-spin" size={32} />
                    </div>
                  ) : proshows.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {proshows.map((proshow) => (
                        <ProshowCard 
                          key={proshow.id} 
                          proshow={proshow} 
                          isAdmin={true}
                          onEdit={(ps) => { setEditingProshow(ps); setIsProshowFormOpen(true); }}
                          onDelete={handleDeleteProshow}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="glass-panel py-20 text-center">
                      <Calendar size={48} className="mx-auto text-border-soft mb-4" />
                      <h3 className="text-lg font-bold text-text-primary">No pro-shows found</h3>
                      <p className="text-text-secondary mt-1">Start by creating a pro-show.</p>
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
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <h2 className="text-4xl font-bold font-serif text-text-primary tracking-wide text-gradient-gold">ANNOUNCEMENTS</h2>
                      <p className="text-sm text-text-secondary mt-2 font-light">Broadcast important updates to students.</p>
                    </div>
                    <Button 
                      className="bg-primary hover:bg-primary-dark text-white rounded-lg px-4 py-2 w-full sm:w-auto"
                      onClick={() => setIsAnnouncementFormOpen(true)}
                    >
                      <Megaphone size={18} className="mr-2" />
                      New Announcement
                    </Button>
                  </div>

                  {announcements.length > 0 ? (
                    <div className="space-y-4 max-w-3xl">
                      {announcements.map((announcement) => (
                        <AnnouncementCard 
                          key={announcement.id} 
                          announcement={announcement} 
                          isAdmin={true}
                          onDelete={handleDeleteAnnouncement}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="glass-panel py-20 text-center max-w-3xl">
                      <Megaphone size={48} className="mx-auto text-border-soft mb-4" />
                      <h3 className="text-lg font-bold text-text-primary">No announcements</h3>
                      <p className="text-text-secondary mt-1">Post an update to reach the student body.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isFormOpen && (
          <EventForm 
            event={editingEvent}
            onClose={() => { setIsFormOpen(false); setEditingEvent(null); }}
            onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
          />
        )}
        {isProshowFormOpen && (
          <ProshowForm 
            proshow={editingProshow}
            onClose={() => { setIsProshowFormOpen(false); setEditingProshow(null); }}
            onSubmit={editingProshow ? handleUpdateProshow : handleCreateProshow}
          />
        )}
        {isAnnouncementFormOpen && (
          <AnnouncementForm 
            onClose={() => setIsAnnouncementFormOpen(false)}
            onSubmit={handleCreateAnnouncement}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
