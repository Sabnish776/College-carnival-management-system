export interface Event {
  id: number;
  title: string;
  description: string;
  category: string;
  eventDateTime: string;
  venue: string;
  maxParticipants: number;
  createdAt: string;
}

export interface EventsResponse {
  events: Event[];
}

export interface EventResponse {
  event: Event;
}
