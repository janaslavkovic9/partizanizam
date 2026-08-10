import { User } from './user.model';

export interface Match {
  id: string;
  opponent: string;
  date: Date;
  location: string;
  ticketLink?: string;
  description?: string;
  organizer?: User;
}