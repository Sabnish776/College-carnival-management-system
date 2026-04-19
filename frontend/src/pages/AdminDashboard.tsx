import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, LogOut, Users, Settings, BarChart3, PlusCircle, Calendar, Search, Filter, Loader2, Trash2, Edit3, User, Megaphone, Send, LayoutDashboard } from 'lucide-react';
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

  const handleDeleteEvent = async (id: number) => {
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
    <div className="min-h-screen bg-zinc-50 font-sans flex flex-col">
      {/* Admin Header */}
      <nav className="bg-white border-b border-zinc-200 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <ShieldCheck size={20} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-zinc-900 leading-tight">CCMS Admin</h1>
              <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">Control Center</p>
            </div>
          </div>

          <div className="flex items-center bg-zinc-100 p-1 rounded-2xl">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  activeTab === item.id 
                    ? "bg-white text-zinc-900 shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-900"
                )}
              >
                <item.icon size={16} />
                <span className="hidden md:block">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/profile')}
              className="hidden lg:flex flex-col items-end mr-2 text-right hover:opacity-80 transition-opacity"
            >
              <p className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                {user?.name}
                <User size={14} className="text-zinc-400" />
              </p>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">System Administrator</p>
            </button>
            <Button variant="secondary" onClick={logout} className="p-2 sm:px-4 sm:py-2">
              <LogOut size={18} />
              <span className="hidden sm:inline ml-2">Sign Out</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-grow p-6 sm:p-10">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Events', value: events.length.toString(), icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Registrations', value: '1,284', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Tickets Sold', value: '850', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'System Status', value: 'Active', icon: Settings, color: 'text-rose-600', bg: 'bg-rose-50' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm"
                    >
                      <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                        <stat.icon size={20} />
                      </div>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-zinc-900 mt-1">{stat.value}</h3>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-white border border-zinc-200 rounded-[2rem] p-12 text-center">
                  <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Welcome to Admin Control Center</h2>
                  <p className="text-zinc-500 mt-2 max-w-lg mx-auto">
                    Manage events, broadcast announcements, and monitor registrations from this centralized dashboard.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Event Management</h2>
                    <p className="text-zinc-500 mt-2">Create, update, and manage all carnival events.</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white border border-zinc-200 rounded-2xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all w-full md:w-64"
                      />
                    </div>
                    <Button 
                      className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
                      onClick={() => { setEditingEvent(null); setIsFormOpen(true); }}
                    >
                      <PlusCircle size={18} />
                      New Event
                    </Button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <Loader2 className="animate-spin mb-4" size={32} />
                    <p className="text-sm font-medium">Loading events...</p>
                  </div>
                ) : filteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="bg-white border border-dashed border-zinc-300 rounded-[2rem] py-20 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300 mb-4">
                      <Calendar size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900">No events found</h3>
                    <p className="text-zinc-500 text-sm mt-1 max-w-xs">
                      Start by creating your first event for the carnival.
                    </p>
                    <Button 
                      variant="secondary" 
                      className="mt-6"
                      onClick={() => { setEditingEvent(null); setIsFormOpen(true); }}
                    >
                      Create Event
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'announcements' && (
              <motion.div
                key="announcements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Announcements</h2>
                    <p className="text-zinc-500 mt-2">Broadcast important updates to all students.</p>
                  </div>
                  
                  <Button 
                    className="bg-zinc-900 hover:bg-zinc-800 shadow-lg shadow-zinc-900/20"
                    onClick={() => setIsAnnouncementFormOpen(true)}
                  >
                    <Megaphone size={18} />
                    New Announcement
                  </Button>
                </div>

                {announcements.length > 0 ? (
                  <div className="flex flex-col gap-6 max-w-4xl">
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
                  <div className="bg-white border border-dashed border-zinc-300 rounded-[2rem] py-20 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300 mb-4">
                      <Megaphone size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900">No announcements yet</h3>
                    <p className="text-zinc-500 text-sm mt-1 max-w-xs">
                      Broadcast your first announcement to the student community.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'proshows' && (
              <motion.div
                key="proshows"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Pro-Show Management</h2>
                    <p className="text-zinc-500 mt-2">Manage artists, tickets, and pro-show details.</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button 
                      className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
                      onClick={() => { setEditingProshow(null); setIsProshowFormOpen(true); }}
                    >
                      <PlusCircle size={18} />
                      New Pro-Show
                    </Button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <Loader2 className="animate-spin mb-4" size={32} />
                    <p className="text-sm font-medium">Loading pro-shows...</p>
                  </div>
                ) : proshows.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="bg-white border border-dashed border-zinc-300 rounded-[2rem] py-20 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300 mb-4">
                      <Calendar size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900">No pro-shows found</h3>
                    <p className="text-zinc-500 text-sm mt-1 max-w-xs">
                      Start by creating your first pro-show.
                    </p>
                    <Button 
                      variant="secondary" 
                      className="mt-6"
                      onClick={() => { setEditingProshow(null); setIsProshowFormOpen(true); }}
                    >
                      Create Pro-Show
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

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
