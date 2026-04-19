export interface Proshow {
  id: string;
  title: string;
  description: string;
  artist: string;
  dateTime: string;
  venue: string;
  ticketPrice: number;
  createdAt: string;
}

export interface ProshowsResponse {
  proshows: Proshow[];
}

export interface ProshowResponse {
  proshow: Proshow;
}

export interface ProshowRegistration {
  proshowId: string;
  proshowTitle: string;
  artist: string;
  venue: string;
  dateTime: string;
  registeredAt: string;
}

export interface ProshowRegistrationsResponse {
  registrations: ProshowRegistration[];
}
