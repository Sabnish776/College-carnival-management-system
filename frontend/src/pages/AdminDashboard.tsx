import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, LogOut, Users, Settings, BarChart3, PlusCircle, Calendar, Search, Filter, Loader2, Trash2, Edit3 } from 'lucide-react';
import { Button } from '../components/ui';
import { EventCard } from '../components/ui/EventCard';
import { EventForm } from '../components/ui/EventForm';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Event } from '../types/event';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
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

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end mr-2 text-right">
              <p className="text-sm font-bold text-zinc-900">{user?.email.split('@')[0]}</p>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">System Administrator</p>
            </div>
            <Button variant="secondary" onClick={logout} className="p-2 sm:px-4 sm:py-2">
              <LogOut size={18} />
              <span className="hidden sm:inline ml-2">Sign Out</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-grow p-6 sm:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Overview */}
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

          {/* Event Management Section */}
          <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Event Management</h2>
                <p className="text-zinc-500 text-sm mt-1">Create, update, and manage all carnival events.</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-zinc-50 border border-zinc-200 rounded-2xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all w-full md:w-64"
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
              <div className="bg-zinc-50 border border-dashed border-zinc-300 rounded-3xl py-20 flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-zinc-300 mb-4 shadow-sm">
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
          </div>
        </div>
      </main>

      {/* Event Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <EventForm 
            event={editingEvent}
            onClose={() => { setIsFormOpen(false); setEditingEvent(null); }}
            onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
