import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, LogOut, Calendar, Ticket, Bell, LayoutDashboard, Search, Filter, Loader2, User, Megaphone } from 'lucide-react';
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

  const handleRegister = async (eventId: number) => {
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

  const isEventRegistered = (eventId: number) => {
    return registrations.some(reg => reg.eventId === eventId.toString());
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
    <div className="min-h-screen bg-zinc-50 font-sans flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-zinc-200 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-zinc-900/20">
              <GraduationCap size={20} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-zinc-900 leading-tight">CCMS Student</h1>
              <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">Cultural Carnival</p>
            </div>
          </div>

          <div className="flex items-center bg-zinc-100 p-1 rounded-2xl">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
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
              <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">{user?.role}</p>
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
            {activeTab === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Upcoming Events</h2>
                    <p className="text-zinc-500 mt-2">Explore and register for exciting cultural activities.</p>
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
                    <Button variant="secondary" className="p-2.5 rounded-2xl">
                      <Filter size={18} />
                    </Button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <Loader2 className="animate-spin mb-4" size={32} />
                    <p className="text-sm font-medium">Fetching latest events...</p>
                  </div>
                ) : filteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  <div className="bg-white border border-dashed border-zinc-300 rounded-[2rem] py-20 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300 mb-4">
                      <Calendar size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900">No events found</h3>
                    <p className="text-zinc-500 text-sm mt-1 max-w-xs">
                      We couldn't find any events matching your search or there are no upcoming events.
                    </p>
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
                <div>
                  <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Announcements</h2>
                  <p className="text-zinc-500 mt-2">Stay updated with the latest news and broadcasts.</p>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <Loader2 className="animate-spin mb-4" size={32} />
                    <p className="text-sm font-medium">Fetching announcements...</p>
                  </div>
                ) : announcements.length > 0 ? (
                  <div className="flex flex-col gap-6 max-w-4xl">
                    {announcements.map((announcement) => (
                      <AnnouncementCard key={announcement.id} announcement={announcement} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-dashed border-zinc-300 rounded-[2rem] py-20 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300 mb-4">
                      <Megaphone size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900">No announcements yet</h3>
                    <p className="text-zinc-500 text-sm mt-1 max-w-xs">
                      Check back later for important updates from the carnival committee.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'proshow' && (
              <motion.div
                key="proshow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Pro-Shows</h2>
                  <p className="text-zinc-500 mt-2">Get your passes for the biggest performances of the carnival.</p>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <Loader2 className="animate-spin mb-4" size={32} />
                    <p className="text-sm font-medium">Fetching pro-shows...</p>
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
                  <div className="bg-white border border-dashed border-zinc-300 rounded-[2rem] py-20 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300 mb-4">
                      <Ticket size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900">No pro-shows listed</h3>
                    <p className="text-zinc-500 text-sm mt-1 max-w-xs">
                      Check back later for exciting pro-show announcements.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'schedule' && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Your Schedule</h2>
                  <p className="text-zinc-500 mt-2">A chronological timeline of all carnival events and pro-shows.</p>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <Loader2 className="animate-spin mb-4" size={32} />
                    <p className="text-sm font-medium">Fetching schedule...</p>
                  </div>
                ) : (
                  <ScheduleTimeline items={timelineItems} />
                )}
              </motion.div>
            )}

            {activeTab !== 'events' && activeTab !== 'announcements' && activeTab !== 'proshow' && activeTab !== 'schedule' && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white border border-dashed border-zinc-300 rounded-[2rem] py-40 flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300 mb-4">
                  <LayoutDashboard size={32} />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-widest">
                  {activeTab} Module
                </h3>
                <p className="text-zinc-500 text-sm mt-2">This feature is coming soon to the CCMS portal.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
