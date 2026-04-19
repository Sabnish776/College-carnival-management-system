import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button, InputField } from './index';
import { Proshow } from '../../types/proshow';

interface ProshowFormProps {
  proshow?: Proshow | null;
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
}

export const ProshowForm: React.FC<ProshowFormProps> = ({ proshow, onSubmit, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    artist: '',
    dateTime: '',
    venue: '',
    ticketPrice: 0,
  });

  useEffect(() => {
    if (proshow) {
      setFormData({
        title: proshow.title,
        description: proshow.description,
        artist: proshow.artist,
        dateTime: proshow.dateTime.split('.')[0], 
        venue: proshow.venue,
        ticketPrice: proshow.ticketPrice,
      });
    }
  }, [proshow]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({
        ...formData,
        createdAt: proshow?.createdAt || new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-zinc-900">
            {proshow ? 'Edit Proshow' : 'Create New Proshow'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <InputField
            label="Proshow Title"
            placeholder="e.g. Comedy Night"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            icon={() => null}
            required
          />
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider ml-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the proshow..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Artist / Performer"
              placeholder="e.g. John Doe"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              icon={() => null}
              required
            />
            <InputField
              label="Ticket Price (₹)"
              type="number"
              placeholder="0"
              value={formData.ticketPrice.toString()}
              onChange={(e) => setFormData({ ...formData, ticketPrice: parseFloat(e.target.value) || 0 })}
              icon={() => null}
              required
            />
          </div>

          <InputField
            label="Date & Time"
            type="datetime-local"
            value={formData.dateTime}
            onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
            icon={() => null}
            required
          />

          <InputField
            label="Venue"
            placeholder="e.g. Open Air Theatre"
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            icon={() => null}
            required
          />
        </form>

        <div className="p-6 border-t border-zinc-100 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} className="flex-1" onClick={handleSubmit}>
            {proshow ? 'Update Proshow' : 'Create Proshow'}
          </Button>
        </div>
      </div>
    </div>
  );
};
